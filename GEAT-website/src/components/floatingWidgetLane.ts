/**
 * The bottom-right corner the floating widgets own, and the space the
 * document has to give back for it.
 *
 * WHY THIS EXISTS
 * ---------------
 * `ScrollToTop` and (on /careers/*) the `GeniChat` launcher are
 * `position: fixed`, so they are outside flow and sit on top of whatever the
 * last content in the document happens to be. At full scroll that is always
 * the footer's legal row — and at 390px the FAB was covering the right-hand
 * end of it ("Preferences" was half behind the button) on every route.
 *
 * A fixed element cannot be given margin by the thing it covers, so the fix
 * is for the document to reserve the lane. That only works if the reserve and
 * the widget offsets stay in agreement, which is why both live here instead
 * of being hardcoded twice.
 *
 * THE ARITHMETIC
 * --------------
 * Stack height = the widget's `bottom-*` offset + its own height:
 *
 *   route          viewport   offset + size        stack
 *   default        <640px     bottom-6  + h-11      68px
 *                  >=640px    bottom-8  + h-12      80px
 *   /careers/*     <640px     bottom-24 + h-11     140px   (cleared above the
 *                  >=640px    bottom-28 + h-12     160px    chat launcher)
 *
 * The footer's own bottom padding (`.section-y-sm` = 40 / 56 / 64px) already
 * covers part of that. The classes below are the REMAINDER plus a ~12px
 * breathing gap, applied to the <footer> element:
 *
 *   default      68 + 12 - 40 =  40  ->  pb-12 (48px), and 80 + 12 - 56 = 36
 *                                        at >=640px, also covered by 48
 *   /careers/*  140 + 12 - 40 = 112  ->  pb-28 (112px)
 *               160 + 12 - 56 = 116  ->  sm:pb-32 (128px)
 *
 * If you move a widget, move it here.
 */

/** ScrollToTop's own position. Offset by the chat launcher on /careers/*. */
export const SCROLL_TOP_POSITION = {
  default: "bottom-6 right-6 sm:bottom-8 sm:right-8",
  careers: "bottom-24 right-5 sm:bottom-28 sm:right-6",
} as const;

/** Space the footer reserves so the widgets never land on the legal row. */
export const FOOTER_WIDGET_LANE = {
  default: "pb-12",
  careers: "pb-28 sm:pb-32",
} as const;

/** The one predicate for "this route also carries the GeniChat launcher". */
export const hasChatLauncher = (pathname: string) =>
  pathname.startsWith("/careers");
