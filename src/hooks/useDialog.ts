import { useEffect, useRef } from "react";

/**
 * One dialog primitive for the whole site.
 *
 * Before this existed there were four hand-rolled focus traps (Navbar drawer,
 * ApplicationStatusModal, GeniChat, ProductDetail lightbox) with four
 * different focusable-element selectors, three different places to restore
 * focus, two of them locking body scroll and two not — and every Escape
 * handler was a bubble-phase `document` listener, so ONE Escape keypress
 * closed EVERY open dialog at once (verified on /careers/faq: two open
 * dialogs, one keypress, both gone).
 *
 * The stack below fixes that: only the topmost open dialog reacts to Escape.
 */

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Open dialogs, oldest first. The last entry owns Escape. */
const stack: symbol[] = [];

function isVisible(el: HTMLElement) {
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

function focusableIn(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible);
}

export type DialogOptions = {
  /** Whether the dialog is currently open. */
  open: boolean;
  /** Called when the user dismisses with Escape. */
  onClose: () => void;
  /**
   * `true`  — a true modal: Tab is trapped inside, body scroll is locked.
   *           Use only when the rest of the page is genuinely unavailable
   *           (there is a backdrop over it).
   * `false` — a non-modal surface docked over the page, like the chat widget.
   *           Escape still closes it and focus is still restored, but Tab may
   *           leave freely, because the page behind it is still usable.
   *           Trapping Tab in a non-modal surface strands keyboard users.
   */
  modal?: boolean;
  /** Element to focus on open. Defaults to the first focusable child. */
  initialFocus?: React.RefObject<HTMLElement>;
};

/**
 * Attach to the dialog's root element.
 *
 *   const panelRef = useRef<HTMLDivElement>(null);
 *   useDialog(panelRef, { open, onClose: () => setOpen(false), modal: true });
 */
export function useDialog(
  ref: React.RefObject<HTMLElement>,
  { open, onClose, modal = true, initialFocus }: DialogOptions
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const initialFocusRef = useRef(initialFocus);
  initialFocusRef.current = initialFocus;

  useEffect(() => {
    if (!open) return;

    const node = ref.current;
    if (!node) return;

    /* --- claim the top of the Escape stack --- */
    const id = Symbol("dialog");
    stack.push(id);

    /* --- remember where focus came from, then move it in --- */
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const target = initialFocusRef.current?.current ?? focusableIn(node)[0] ?? node;
    if (target === node && !node.hasAttribute("tabindex")) node.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });

    /* --- lock background scroll, modal only --- */
    let restoreOverflow: (() => void) | undefined;
    if (modal) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      restoreOverflow = () => {
        document.body.style.overflow = previous;
      };
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        /* Only the topmost dialog closes. */
        if (stack[stack.length - 1] !== id) return;
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key !== "Tab" || !modal) return;

      const items = focusableIn(node);
      if (items.length === 0) {
        /* Nothing to move to — keep focus on the container rather than
           letting it escape a genuinely modal surface. */
        e.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !node.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !node.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreOverflow?.();

      const i = stack.indexOf(id);
      if (i !== -1) stack.splice(i, 1);

      /* Only restore focus if it is still inside the closing dialog —
         otherwise the user has already moved on and we would yank them back. */
      if (previouslyFocused && node.contains(document.activeElement)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, modal, ref]);
}
