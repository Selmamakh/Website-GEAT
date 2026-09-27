# GEAT — UI/UX Design System & Guidelines

Marketing website for **GEAT (General Electric Algeria Turbines)**, built with Vite, React 18, TypeScript, Tailwind CSS and shadcn/ui, in English and French.

This document is the reference for the site's **UI/UX design system**. Every value in it was read out of the codebase — no values are invented. Where something is a suggestion rather than current behaviour it is placed under an explicitly marked **Recommended** heading.

> **How to read this document**
> Sections 1–10 describe **what the code does today**. Blocks headed **⚠ Recommended** are *not* implemented and describe improvements worth considering. Section 11 is the rulebook for new work.

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [UI/UX design system](#2-uiux-design-system)
3. [Layout & structure](#3-layout--structure)
4. [Responsive design](#4-responsive-design)
5. [Pages](#5-pages)
6. [Components](#6-components)
7. [UX guidelines](#7-ux-guidelines)
8. [Images & assets](#8-images--assets)
9. [Animations & interactions](#9-animations--interactions)
10. [Accessibility](#10-accessibility)
11. [UI/UX rules for future development](#11-uiux-rules-for-future-development)
12. [Design tokens reference](#12-design-tokens-reference)
13. [Development](#13-development)

---

## 1. Project overview

### Purpose

GEAT is a joint-venture industrial manufacturer that builds and services gas turbines, steam turbines and auxiliary piping/skid systems in Batna, Algeria. The website is a **corporate marketing and recruitment site**. It has four jobs:

1. Present the company and its leadership (`/about`, `/leadership`).
2. Present the product, technology and service portfolio (`/products-services` and its detail pages).
3. Publish news and milestones (`/news`).
4. Run the full recruitment funnel — browse, filter, read, apply, track (`/careers/*`).

There is no e-commerce, no authenticated area and no CMS: all content is authored in TypeScript data modules under [src/data/](src/data/) and [src/i18n/](src/i18n/).

### Target users

| Audience | What they came for | Where they land |
| --- | --- | --- |
| Utility / EPC / industrial buyers | Turbine specifications, service capability, contact route | `/products-services`, `/contact` |
| Job seekers (engineers, technicians, graduates) | Open roles, application process, life at GEAT | `/careers/*` |
| Journalists & institutional partners | Company facts, milestones, media contact | `/news`, `/about`, `/leadership` |
| Existing applicants | Status of a submitted application | Application Status modal (any `/careers/*` page) |

Both English and French are first-class; French is served through a dictionary keyed on the English source string ([src/i18n/](src/i18n/)) and the choice is persisted to `localStorage` under `geat-lang`.

### Overall design direction

Industrial, high-contrast and photography-led. The recurring structure is a **full-bleed photograph under a navy scrim, with a hard amber rule marking the start of the text block**. Content sits on a near-white ground and is punctuated by full-width navy bands (`surface-dark`) that carry statistics, quotes and closing calls to action.

The design vocabulary is deliberately **linear**: rules, underlines, bars and arrows. There is a documented decision in [KickerLabel.tsx](src/components/KickerLabel.tsx) *not* to use filled circles as ornament — round marks are reserved for state (current step, presence), lines for decoration.

### Brand identity and visual style

The brand colours are sampled directly from the logo bitmap rather than guessed. From the comment block in [index.css:37-46](src/index.css#L37-L46), the logo was decoded to a canvas and every fully opaque pixel histogrammed:

| Colour | Pixels | Modal value | HSL |
| --- | --- | --- | --- |
| Amber / orange | 8,245 | `#FF9013` | `hsl(32 100% 54%)` |
| Blue | 25,497 | `#0287C8` | `hsl(200 98% 40%)` |

The single most important rule in the entire system follows from this:

> ### 🔶 Orange is a **surface** colour, not a text colour on light grounds
>
> `#FF9013` on the near-white page measures **2.27:1** — far below the 4.5:1 AA floor. Every hue dark enough to pass reads as brown, not orange, so there is no "darker orange" escape hatch. On light grounds the amber is therefore used **only** for button fills, ornaments, rules, decorative marks and active-state indicators — none of which carry a text-contrast requirement.
>
> Inside a `.surface-dark` container the constraint disappears (the same amber is **6.64:1** on navy), so `text-primary` becomes real orange text there.
>
> Full rationale: [index.css:83-106](src/index.css#L83-L106).

Text that would naively be orange uses these substitutes instead:

| Role | Token | Contrast |
| --- | --- | --- |
| Eyebrows / meta labels | `text-muted-foreground` | 5.61:1 |
| Inline prose links | `text-accent` (logo blue) | 4.96:1 |
| CTA-style links | `text-foreground` + amber arrow glyph | — |
| Required-field asterisks | `text-destructive` | — |
| Separators / bullets | `text-muted-foreground` | 5.61:1 |

---

## 2. UI/UX design system

All colour is expressed as **HSL channel triplets in CSS custom properties**, consumed through Tailwind as `hsl(var(--token))`. Components must never hardcode a hex or `hsl()` literal.

### 2.1 The two-layer token model

```
Layer 1  BRAND     fixed identity values (--geat-orange, --geat-blue, …)
                   Never change these to fix a contrast bug.
Layer 2  SEMANTIC  what components consume (--primary, --muted-foreground, …)
                   Surface-aware: :root defines them for light grounds,
                   .surface-dark redefines them for navy grounds.
```

To place content on a dark ground you add `surface-dark` to the container. **Every token inside retargets automatically** — children keep using `text-primary`, `text-muted-foreground`, `border-border` with no per-instance overrides.

```tsx
// Correct — one class flips the whole subtree
<section className="surface-dark section-y bg-geat-dark">
  <h2 className="text-foreground">Numbers</h2>
  <p className="text-muted-foreground">…</p>
</section>
```

### 2.2 Brand palette

| Token | HSL | Hex | Role |
| --- | --- | --- | --- |
| `--geat-dark` | `215 30% 16%` | `#1D2735` | Navy ground for heroes, footer, stat bands |
| `--geat-orange` | `32 100% 54%` | `#FF9013` | Logo amber — fills and ornaments |
| `--geat-orange-dark` | `32 100% 38%` | `#C26700` | Amber deepened to work as a **border** on white (3.74:1). Not a text colour. |
| `--geat-blue` | `200 98% 32%` | `#026CA2` | Logo hue darkened to clear 4.5:1 on every light ground |
| `--geat-blue-light` | `200 90% 62%` | `#47BBF5` | Blue legible on navy (6.96:1) |
| `--geat-light` | `216 20% 96%` | — | Light neutral |

### 2.3 Semantic colours — light ground (`:root`)

| Token | Value | Usage |
| --- | --- | --- |
| `--background` | `220 13% 97%` | Page ground |
| `--foreground` | `215 25% 17%` | Body text |
| `--card` | `0 0% 100%` | Card / panel surface |
| `--card-foreground` | `215 25% 17%` | Text on cards |
| `--popover` | `0 0% 100%` | Dropdown / popover surface |
| `--popover-foreground` | `215 25% 17%` | Text in popovers |
| `--primary` | `var(--brand-fill)` → `#FF9013` | **Fill/ornament only on light** |
| `--primary-foreground` | `var(--geat-dark)` | Label on a primary fill (6.64:1) |
| `--primary-shimmer` | `32 100% 38%` | Highlight sweep stop (unused on light today) |
| `--secondary` | `216 20% 96%` | Alternating section band |
| `--secondary-foreground` | `215 25% 17%` | Text on secondary |
| `--muted` | `216 16% 93%` | Muted surface, progress rails |
| `--muted-foreground` | `215 14% 40%` | Secondary text (5.61:1) |
| `--accent` | `var(--geat-blue)` → `#026CA2` | Links, hover sweep, chips (4.96:1) |
| `--accent-foreground` | `0 0% 100%` | Text on accent |
| `--destructive` | `0 72% 42%` | Errors, required marks |
| `--destructive-foreground` | `0 0% 100%` | Text on destructive |
| `--success` | `152 62% 32%` | Success states |
| `--success-foreground` | `0 0% 100%` | Text on success |
| `--border` | `218 15% 91%` | Hairlines, dividers |
| `--input` | `216 14% 90%` | Form control borders |
| `--ring` | `var(--brand-fill-edge)` | Focus ring |

### 2.4 The brand-fill triplet

The button fill is deliberately its **own** token, decoupled from `--primary`:

| Token | Value | Why |
| --- | --- | --- |
| `--brand-fill` | `var(--geat-orange)` | A fill is a surface; its label supplies the contrast, so it has no lightness cap |
| `--brand-fill-foreground` | `var(--geat-dark)` | 6.64:1 on the fill |
| `--brand-fill-edge` | `32 100% 38%` | 1px rim; 3.74:1 vs page, 4.01:1 vs card — gives the pill a boundary (WCAG 1.4.11) |

Coupling the fill to `--primary` is what previously produced a rust-brown button: the fill was dragged down to the *text* colour's ceiling. Exposed in Tailwind as `bg-brand` / `text-brand-foreground` / `border-brand-edge`.

### 2.5 Semantic colours — dark ground (`.surface-dark`)

| Token | Value | Measured contrast |
| --- | --- | --- |
| `--background` | `var(--geat-dark)` | — |
| `--foreground` | `0 0% 100%` | 14.11:1 on card |
| `--card` | `215 28% 18%` (`#212C3B`) | Chosen over 21% so `--primary` on a card clears AA |
| `--primary` | `var(--geat-orange)` | 6.64:1 on ground, 4.74:1 on card |
| `--primary-foreground` | `var(--geat-dark)` | — |
| `--primary-shimmer` | `36 100% 76%` | Brighter on navy — the sweep goes the other way |
| `--secondary` / `--muted` | `215 25% 24%` | — |
| `--muted-foreground` | `214 18% 76%` | 6.6:1 on ground, 7.68:1 on card |
| `--accent` | `var(--geat-blue-light)` | 6.96:1 |
| `--accent-foreground` | `215 30% 12%` | — |
| `--destructive` | `0 80% 70%` | 5.39 ground / 5.04 card |
| `--success` | `152 60% 70%` | 9.57 ground / 8.96 card |
| `--border` / `--input` | `215 20% 32%` | — |
| `--ring` | `28 97% 70%` | 8.2:1 |

**State colours retarget too.** The light-ground `--destructive` and `--success` measure 2.3:1 and 3.2:1 on navy — an error message inside a `surface-dark` form would be unreadable without this block.

> **Note on `.dark`** — [tailwind.config.ts:4](tailwind.config.ts#L4) sets `darkMode: ["class"]`, but a site-wide `.dark` theme was **deliberately removed**: nothing ever added the class and there were zero `dark:` variants in application code. `.surface-dark` replaced it. Do not reintroduce `dark:` variants.

### 2.6 Typography

Loaded from Google Fonts in [index.css:1](src/index.css#L1):

| Family | Tailwind class | Weights loaded | Used for |
| --- | --- | --- | --- |
| **DM Sans** | `font-heading` | 300–800, plus italic 400 | All headings, buttons, eyebrows, nav |
| **Inter** | `font-body` | 300–700 | Body copy (applied to `<body>`) |

`<body>` gets `font-body antialiased`; `h1`–`h6` get `font-heading` automatically via a base-layer rule, so headings do **not** need an explicit `font-heading` class (though 157 call sites add it for clarity on non-heading elements).

#### Font sizes in use

Tailwind's default scale. Actual usage across `src/**/*.tsx`:

| Class | Size | Occurrences | Typical use |
| --- | --- | --- | --- |
| `text-sm` | 0.875rem / 14px | 190 | Nav links, body meta, form labels, footer links |
| `text-3xl` | 1.875rem / 30px | 53 | Section `<h2>` mobile size |
| `text-xs` | 0.75rem / 12px | 50 | Eyebrows, badges, error messages |
| `text-4xl` | 2.25rem / 36px | 43 | Section `<h2>` desktop size |
| `text-lg` | 1.125rem / 18px | 39 | Lead paragraphs, nav panel headings |
| `text-base` | 1rem / 16px | 29 | Default paragraph |
| `text-2xl` | 1.5rem / 24px | 19 | Card titles, sub-headings |
| `text-xl` | 1.25rem / 20px | 18 | Small section headings |
| `text-5xl` | 3rem / 48px | 6 | Stat figures, large headings |
| `text-6xl` – `text-8xl` | 3.75–6rem | 6 | Display numerals |

Two arbitrary sizes exist: `text-[2.5rem]` (ProductDetail closing CTA) and `text-[8rem]` (display numeral).

#### Font weights

Semantic names are preferred. Numeric utilities `font-600` / `font-700` / `font-800` are **registered as a safety net** in [tailwind.config.ts:25-29](tailwind.config.ts#L25-L29) — previously 12 call sites used numeric classes that compiled to nothing and silently rendered at 400.

| Class | Weight | Occurrences |
| --- | --- | --- |
| `font-bold` | 700 | 123 |
| `font-semibold` | 600 | 74 |
| `font-medium` | 500 | 37 |
| `font-extrabold` | 800 | 7 |
| `font-normal` | 400 | 5 |
| `font-black` | 900 | 1 |

#### Heading styles

**Hero headline** — one class, used by both hero components:

```css
.hero-headline {
  font-family: "DM Sans";
  font-weight: 800;          /* extrabold */
  text-transform: uppercase;
  letter-spacing: 0.025em;   /* tracking-wide */
  line-height: 1.25;         /* leading-tight */
  font-size: clamp(1.5rem, 7vw, 3rem);   /* 24px → 48px, fluid */
  overflow-wrap: break-word;
  text-wrap: balance;
}
```

**Section headings** — the dominant pattern across the site:

```tsx
<h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
```

Variants observed: `md:text-4xl` on About/Leadership, `lg:text-5xl` on WhoWeAre, `font-extrabold` where the heading is the section's focal point (StatsSection, News milestones).

**Card titles** — `text-2xl font-bold` (custom cards) or the shadcn `CardTitle`: `text-2xl font-semibold leading-none tracking-tight`.

#### Paragraph styles

| Context | Classes |
| --- | --- |
| Hero subtitle | `mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg` |
| Section lead | `text-muted-foreground leading-relaxed` (often `max-w-sm` / `max-w-3xl`) |
| Card description | `text-sm text-muted-foreground` |
| Meta / date | `text-xs text-muted-foreground` |

Measure is capped with `max-w-2xl` (hero subtitle), `max-w-3xl` (hero text block, prose) and `max-w-5xl` (nav mega-menu grid).

#### Eyebrow / kicker

One component owns this — see [§6 KickerLabel](#kickerlabel). Canonical type: `font-heading font-semibold uppercase tracking-[0.2em]` at `text-[11px]` / `text-xs` / `text-sm`.

### 2.7 Border radius

Driven by a single token, `--radius: 0.5rem`:

| Class | Computed | Source |
| --- | --- | --- |
| `rounded-sm` | `calc(0.5rem - 4px)` = **0.25rem** | token |
| `rounded-md` | `calc(0.5rem - 2px)` = **0.375rem** | token |
| `rounded-lg` | `var(--radius)` = **0.5rem** | token |
| `rounded-xl` | 0.75rem | Tailwind default |
| `rounded-2xl` | 1rem | Tailwind default |
| `rounded-full` | 9999px | Tailwind default |

Usage: `rounded-full` (73) → `rounded-md` (51) → `rounded-2xl` (27) → `rounded-lg` (26) → `rounded-xl` (25) → `rounded-sm` (22).

**Mobile softening** — below 768px, `.rounded-2xl` is reduced to `0.875rem` ([index.css:803](src/index.css#L803)) so large cards do not look over-rounded on small screens.

Conventions in practice: pills and FABs → `rounded-full`; form controls and small buttons → `rounded-md` / `rounded-lg`; content cards and panels → `rounded-2xl`; photo cards in carousels → `rounded-sm`.

### 2.8 Shadows

Tailwind's default scale is used for most elevation — `shadow-sm` (22), `shadow-lg` (20), `shadow-md` (16), `shadow-xl` (11), `shadow-2xl` (9).

Bespoke shadows are written as arbitrary values referencing tokens, e.g.:

```
shadow-[0_16px_40px_-18px_hsl(var(--geat-dark)/0.28)]
shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.25)]
shadow-[0_30px_60px_-20px_hsl(var(--geat-orange)/0.35)]
```

The CTA button carries its own shadow ladder:

| State | Shadow |
| --- | --- |
| Rest | `0 8px 20px -8px hsl(var(--brand-fill) / 0.5)` |
| Hover | `0 14px 28px -10px hsl(var(--accent) / 0.55)` |
| Active | `0 6px 16px -6px hsl(var(--accent) / 0.7), 0 0 0 6px hsl(var(--accent) / 0.18)` |

> **⚠ Recommended** — there are ~15 distinct arbitrary shadow values. Consider promoting the three or four that recur into named tokens (`--shadow-card`, `--shadow-raised`, `--shadow-overlay`) so elevation becomes a scale rather than a per-component decision.

### 2.9 Borders

A global base rule sets the default border colour so a bare `border` class is always token-driven:

```css
* { @apply border-border; }
```

| Use | Class |
| --- | --- |
| Card / panel edge | `border border-border` |
| Hairline divider | `<div className="h-px bg-border" />` or `border-t border-border` |
| Form control | `border border-input` |
| Amber control edge | `border-brand-edge` (1px on `.btn-cta`, 1.5px on outline CTAs, 2px on outline pills) |
| Error state | `border-2 border-destructive` |
| Hero text-block marker | `<div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />` |

### 2.10 Spacing system

**Vertical rhythm is a closed set of three classes.** Ad-hoc `py-*` on a top-level `<section>` is not permitted.

| Class | Mobile | ≥640px | ≥1024px | Use |
| --- | --- | --- | --- | --- |
| `.section-y-sm` | 40px | 56px | 64px | Tight bands, sub-navs, CTA strips |
| `.section-y` | 56px | 80px | 96px | **The default** (48 call sites) |
| `.section-y-lg` | 72px | 96px | 128px | Opening statements, closing CTAs |
| `.section-head` | `mb-8` | `mb-10` | `mb-12` | Gap between a heading block and its content |

The matching raw tokens exist as `--space-section` (3.5rem), `--space-section-sm` (5rem), `--space-section-lg` (6rem).

Within sections, Tailwind's default 4px-based scale is used. Common grid gaps: `gap-5`, `gap-8`, `gap-10`, `gap-12`, `lg:gap-16`, `lg:gap-20`.

### 2.11 Container / max-width rules

```css
.section-container {
  @apply max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12;
}
```

**1400px max width; 20px / 24px / 48px horizontal padding.** Used 72 times — this is *the* page gutter. Every hero, section, nav panel and the footer route through it.

Tailwind's own `container` is configured (`center: true`, `padding: 2rem`, `2xl: 1400px`) but is effectively unused in application code; `.section-container` supersedes it.

### 2.12 Buttons

Three distinct button systems exist, each with a defined role.

#### A. `.btn-cta` — the site's primary call to action

The one control that must read as the brand mark. Defined in [index.css:459-571](src/index.css#L459-L571).

| Property | Value |
| --- | --- |
| Shape | `border-radius: 9999px`, `min-height: 2.875rem` (46px) |
| Padding | `0.75rem 1.5rem` |
| Type | DM Sans, 600, `0.9375rem` (15px) |
| Fill | `hsl(var(--brand-fill))` — **identical on every surface**, does *not* flip with `.surface-dark` |
| Label | `hsl(var(--brand-fill-foreground))` |
| Border | `1px solid hsl(var(--brand-fill-edge))` |
| Gap | `0.625rem` between label and icon |

**Hover** (gated to `@media (hover: hover) and (pointer: fine)`) — a blue sweep fills from the left:

```css
.btn-cta::before { transform: translateX(-101%); transition: transform 0.55s cubic-bezier(0.77, 0, 0.18, 1); }
.btn-cta:hover::before { transform: translateX(0); }
.btn-cta:hover { color: hsl(var(--accent-foreground)); transform: translateY(-2px); }
```

**Active** — locks to the full accent fill, `scale(0.97)`, with a 6px accent halo.
**Focus** — `outline: 3px solid hsl(var(--ring)); outline-offset: 3px`.
**Below 480px** — `width: 100%`, `max-width: 20rem`, padding reduced to `0.75rem 1.25rem`.

Modifiers:

| Class | Effect |
| --- | --- |
| `.btn-cta-outline` | Transparent, `1.5px` amber-edge border, `text-foreground` — secondary CTA on light |
| `.btn-cta-outline-light` | Transparent, `1.5px` border at `foreground/45` — secondary CTA inside `surface-dark` |
| `.cta-pulse` | Entry fade + 2.4s pulsing halo (used once, capped to one iteration) |

#### B. `<Button>` — the shadcn primitive

[src/components/ui/button.tsx](src/components/ui/button.tsx). Base: `inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium`, with `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` and `disabled:opacity-50`.

| Variant | Classes |
| --- | --- |
| `default` | `bg-brand text-brand-foreground hover:bg-brand/90` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |
| `outline` | `border border-input bg-background hover:bg-accent hover:text-accent-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-accent underline-offset-4 hover:underline` |

| Size | Height / padding |
| --- | --- |
| `default` | `h-10 px-4 py-2` |
| `sm` | `h-9 px-3` |
| `lg` | `h-11 px-8` |
| `icon` | `h-10 w-10` |

Used mainly inside forms and dialogs. `asChild` renders through a Radix `Slot` so a `<Link>` can carry button styling.

#### C. Bespoke pill links

A recurring outline-pill pattern for tertiary navigation, e.g. in [WhatWeDo.tsx:160](src/components/WhatWeDo.tsx#L160):

```tsx
className="group inline-flex min-h-11 items-center gap-2 px-6 py-3 rounded-full
           border-2 border-brand-edge text-foreground font-bold text-xs
           uppercase tracking-wider hover:bg-brand hover:text-brand-foreground transition-all"
```

### 2.13 Links

| Kind | Treatment |
| --- | --- |
| **Inline prose link** | `.link-inline` — `underline underline-offset-2 decoration-accent/40 hover:decoration-accent`. Painted `text-accent` (logo blue). Exempt from the 44px coarse-pointer floor. |
| **Nav link (desktop)** | `text-sm font-medium text-foreground hover:text-accent` + a 2px amber underline that animates `w-0 → w-full` over 300ms |
| **Nav panel link** | `text-base font-heading hover:bg-muted/50 hover:text-accent`, with an arrow that fades and slides in on hover |
| **Footer link** | `text-sm text-muted-foreground hover:text-primary` with a leading amber rule that grows `w-0 → w-3` |
| **CTA-style link** | `text-foreground` plus an amber `ArrowRight` glyph — never orange text |
| **Breadcrumb link** | `.tap-target justify-start rounded-md hover:text-accent` |

### 2.14 Icons

**[lucide-react](https://lucide.dev) is the only icon set.** No custom icon font, no SVG sprite. The one hand-authored SVG is the L-shaped arrow ornament in `KickerLabel`.

| Context | Size |
| --- | --- |
| Inline with text / in buttons | `h-4 w-4` (16px) — enforced on `<Button>` via `[&_svg]:size-4` |
| Small ornament / breadcrumb chevron | `h-3.5 w-3.5` or `h-4 w-4` |
| Carousel & nav controls | `h-5 w-5` (20px) |
| Hamburger / drawer close | `w-6 h-6` (24px) |
| Decorative large mark | `w-20 h-20` with `strokeWidth={1}` |

Rules: decorative icons carry `aria-hidden="true"`; an icon that *is* the control carries an `aria-label` on the button; icons inherit colour via `currentColor` and are wrapped in `.tap-target` when the visible mark is smaller than 44px.

### 2.15 Cards

Two families coexist.

**shadcn `<Card>`** — `rounded-lg border bg-card text-card-foreground shadow-sm`, with `CardHeader` (`p-6 space-y-1.5`), `CardContent` (`p-6 pt-0`), `CardFooter` (`flex items-center p-6 pt-0`).

**Bespoke content cards** — the dominant site pattern:

```tsx
className="group flex flex-col justify-between rounded-2xl border border-border
           bg-card p-6 lg:p-8 transition-transform duration-500 hover:-translate-y-1"
```

**Photo cards** — a fixed aspect ratio, a full-bleed `object-cover` image that scales on hover, and a `surface-dark` gradient panel carrying the title:

```tsx
<Link className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-muted">
  <img alt="" className="absolute inset-0 w-full h-full object-cover
                         transition-transform duration-700 group-hover:scale-105" />
  <div className="surface-dark absolute inset-0 bg-gradient-to-t
                  from-geat-dark/85 via-geat-dark/20 to-transparent">
    <h3 className="absolute left-6 right-6 bottom-6 font-heading font-bold text-2xl text-foreground">…</h3>
  </div>
</Link>
```

Optional hover behaviours: `.tilt-card` (3D perspective tilt), `.card-aura` (lift + pulsing amber glow), `.card-ripple` (radial ripple on `:active`).

### 2.16 Forms

**One field primitive governs every form on the site** — [FormField.tsx](src/components/FormField.tsx). Forms exist on `/contact`, `/careers/jobs/:slug/apply`, `/careers/submit-cv` and inside the Application Status modal. Validation is **[zod](https://zod.dev)** schemas in each page.

| Export | Value / purpose |
| --- | --- |
| `FIELD_INPUT_CLASS` | `h-12 w-full rounded-lg border border-input bg-background px-4 text-sm …` — **48px tall**, the one text-control shape |
| `FIELD_TEXTAREA_CLASS` | Same box, free height, `p-4` |
| `FIELD_INVALID_CLASS` | `border-2 border-destructive` — the border *doubles in width*, so the state is not colour-alone |
| `REQUIRED_MARK_CLASS` | `text-destructive` (not amber — a 12px asterisk is the smallest text on the form) |
| `CHECKBOX_TAP_WRAP_CLASS` / `CHECKBOX_TAP_AREA_CLASS` | A 16px checkbox with a real 44×44 activation overlay |
| `<FieldError>` | Always-rendered `aria-live="polite"` region + `AlertCircle` icon |
| `<FormRequiredLegend>` | The "* required" legend every form shows once |
| `<FormErrorSummary>` | `role="alert"`, `tabIndex={-1}` submit-time summary that links to and focuses each bad field |

The shadcn `<Input>` primitive (`h-10 rounded-md border-input`) also exists and is used inside dialogs; `FIELD_INPUT_CLASS` is the site-wide standard for page forms.

Field anatomy:

```tsx
<FormField id="email" label="Email" required error={errors.email}>
  {(control) => <input type="email" {...control} />}
</FormField>
// FormField supplies: id/htmlFor binding, aria-invalid, aria-describedby,
// aria-required, the shape class, and the permanent error region.
```

### 2.17 Badges & labels

**`<Badge>`** — [src/components/ui/badge.tsx](src/components/ui/badge.tsx):

```
inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors
```

| Variant | Classes |
| --- | --- |
| `default` | `border-transparent bg-brand text-brand-foreground hover:bg-brand/80` |
| `secondary` | `border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `destructive` | `border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80` |
| `outline` | `text-foreground` |

**Eyebrow labels** use `<KickerLabel>` — never a Badge. **Job meta chips** (department, location, contract type) in `OpenJobsBoard` are inline `text-xs` runs separated by `·` in `text-muted-foreground`.

---

## 3. Layout & structure

### 3.1 Page skeleton

Every page follows the same shell:

```tsx
<div className="min-h-screen">
  <Navbar />                    {/* fixed */}
  {/* <CareersSubNav /> on /careers/* only — sticky */}
  <main id="main">
    <PageHero … />              {/* or <HeroSlider /> on / */}
    <section className="section-y …">…</section>
    …
    <Newsletter />              {/* on marketing pages */}
  </main>
  <Footer />
  {/* <GeniChat /> on /careers/* — fixed */}
</div>
```

`ScrollToTop` and `RevealOnScroll` are mounted once in [App.tsx](src/App.tsx) above `<Routes>` and apply site-wide.

### 3.2 Header / navbar

```tsx
<header className="fixed top-0 left-0 right-0 z-50 bg-card">
  <div className="section-container flex items-center justify-between h-16 lg:h-20">
```

| Aspect | Value |
| --- | --- |
| Position | `fixed`, `z-50`, opaque `bg-card` |
| Height | **64px**, **80px** from `lg` |
| Space reservation | `body { padding-top: 4rem }`, `5rem` at ≥1024px — **in CSS, not a spacer div** |
| Logo | `h-12 lg:h-16 w-auto`, intrinsic `505×337` |
| Desktop nav | `hidden lg:flex items-center gap-8` |
| Mobile trigger | `lg:hidden`, `.tap-target` |

**The height reservation is load-bearing.** The header is fixed, so it occupies no space in flow. `body { padding-top }` does the reservation once, globally. Two spacer `<div>`s once rendered on careers routes (one in `Navbar`, one in `CareersSubNav`) and stacked into a 160px gap. **Do not reintroduce a spacer element** — keep `h-16 lg:h-20`, `padding-top: 4rem/5rem` and the sub-nav's `top-16 lg:top-20` in lockstep.

#### Navigation structure

```
Company              → About us · Leadership                       (single-column dropdown)
Products & Services  → Products · Technologies & Solutions · Services  (3-column mega menu)
News                 → /news                                        (direct link)
Careers              → /careers                                     (direct link)
Contact              → /contact                                     (direct link)
```

Both panel shapes render through **one** component, `NavPanelColumn`, and **one** grid (`grid max-w-5xl gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3`). A single-level dropdown is simply a one-column panel. This normalisation is what prevents the two layouts drifting apart — as they previously had, with different ornaments, rule axes and heading semantics.

A column heading is a `<Link>` with a trailing amber arrow when the section has a landing page, and plain text with **no arrow** when it does not (`min-h-11` keeps the hairline rule on the same baseline either way).

#### Navigation behaviour

| Interaction | Behaviour |
| --- | --- |
| Hover trigger | Opens the panel immediately |
| Leave trigger/panel | Closes after a **250ms** grace timer |
| Click trigger | Toggles open/closed |
| `Escape` | Closes and returns focus to the trigger |
| Click outside | Closes (mousedown listener on `document`) |
| Tab out of trigger+panel | Closes (guarded — a `null` `relatedTarget` is ignored so panel clicks are never eaten) |
| Panel when closed | **Unmounted** — it previously parked 11 invisible tab stops in the header |

The trigger carries `aria-expanded`, `aria-haspopup`, `aria-controls`; its chevron rotates 180° over 300ms; a 2px amber underline animates to full width.

The panel is `fixed left-0 right-0 top-16 lg:top-20` — a full-bleed bar under the header — with `animate-in fade-in slide-in-from-top-2 duration-300`.

#### Mobile drawer (`< 1024px`)

| Aspect | Value |
| --- | --- |
| Width | `w-[86vw] max-w-sm`, right-anchored, `h-[100dvh]` |
| Entry | `animate-in slide-in-from-right duration-300 ease-out` |
| Backdrop | `bg-foreground/50 backdrop-blur-sm`, `animate-in fade-in duration-300` |
| Semantics | `role="dialog" aria-modal="true"`, driven by `useDialog` (focus trap, scroll lock, Escape, focus restore) |
| Rows | `min-h-14` (56px) top level, `min-h-11`/`min-h-12` for children, each `border-b border-border` |
| Accordion | `aria-expanded` + `aria-controls`; chevron rotates 180°; `animate-in fade-in slide-in-from-top-1 duration-200` |
| Footer of drawer | A full-width `.btn-cta` to the jobs board |
| Side effect | Adds `body.menu-open`, which hides floating widgets |

Like the desktop panels, the drawer is **unmounted while closed**.

### 3.3 Careers sub-nav

A second-level sticky bar on `/careers/*`:

```tsx
<nav className="sticky top-16 z-40 border-b border-border
                bg-gradient-to-b from-muted to-background shadow-sm lg:top-20">
  <div className="section-container no-scrollbar flex items-center gap-5 overflow-x-auto py-1 sm:gap-6 sm:py-1.5">
```

Horizontally scrollable with a hidden scrollbar on narrow screens. The current page is marked by `aria-current="page"`, `font-semibold`, **and** an amber underline (`decoration-primary decoration-2 underline-offset-4`) — never by colour alone. Ends with an "All Jobs" amber pill.

### 3.4 Hero sections

All hero geometry lives in [heroStyles.ts](src/components/heroStyles.ts) and is shared by `PageHero` and `HeroSlider`.

```ts
HERO_FRAME = "surface-dark relative flex min-h-[300px] items-end overflow-hidden
              bg-geat-dark sm:min-h-[340px] lg:min-h-[370px]"

HERO_CONTENT_PADDING        = "pb-12 pt-20 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28"
HERO_CONTENT_PADDING_SLIDER = "pb-24 pt-20 sm:pb-32 sm:pt-24 lg:pb-36 lg:pt-28"

HERO_IMAGE = "absolute inset-0 h-full w-full object-cover object-center"
HERO_IMAGE_WIDTH = 1920;  HERO_IMAGE_HEIGHT = 1080;
```

**Padding is the constant; height is the leftover.** Heroes were once a fixed height with `items-end`, which made the *top* gap a leftover that varied with content — a measured **220px spread** across 13 routes (108px on `/products-services`, 328px on `/careers/life-at-geat`). Inverting the relationship gives 112–128px of clear space on every route (a 16px spread), with hero height varying 420–544px as a natural consequence of headline length.

The slider's larger `pb` is a **declared** difference, not drift: it is the reserved lane for the carousel control bar pinned to `bottom-0`.

**Layering**, bottom to top:

1. `<img>` — full-bleed cover, `animate-ken-burns` on `PageHero`
2. Horizontal scrim — `from-geat-dark/95 via-geat-dark/90 to-geat-dark/85 sm:via-geat-dark/80 sm:to-geat-dark/45`
3. Vertical scrim — `from-geat-dark/80 via-transparent to-geat-dark/40`
4. `.section-container relative z-10` — breadcrumb, then a `max-w-3xl pl-6 lg:pl-8` block with a `w-1 bg-primary` bar down its left edge

> The **mobile scrim floor is deliberate**. Below `sm` the horizontal sweep holds an 85% floor because the `max-w-3xl` copy block spans the whole frame at 390px and its last third would otherwise land on the thin `/45` stop — measured at 2.55:1 on `/products-services/gas-turbines`. From `sm` up the copy never reaches the thin end, so the photograph opens back up.

### 3.5 Content sections

The standard shape:

```tsx
<section className="section-y bg-background">        {/* or bg-secondary / bg-card / bg-muted/40 */}
  <div className="section-container">
    <div className="section-head">
      <KickerLabel label="About GEAT" />
      <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">…</h2>
    </div>
    {/* content */}
  </div>
</section>
```

Section grounds alternate to create rhythm: `bg-background` → `bg-secondary` / `bg-secondary/50` / `bg-muted/40` → `surface-dark bg-geat-dark`. Navy bands are used for statistics, quotes and closing CTAs.

### 3.6 Cards & grids

| Pattern | Occurrences | Typical use |
| --- | --- | --- |
| `sm:grid-cols-2` | 17 | Two-up card rows |
| `md:grid-cols-2` / `lg:grid-cols-2` | 20 | Split content/media layouts |
| `lg:grid-cols-3` | 9 | Three-up card grids |
| `lg:grid-cols-4` | 8 | Dense tile grids |
| `md:grid-cols-3` | 4 | Footer link columns, value grids |
| `md:grid-cols-12` / `lg:grid-cols-12` | 2 | Footer (3/5/4 split), asymmetric layouts |

Asymmetric named tracks appear where a sidebar is fixed-width: `lg:grid-cols-[340px_1fr]` (WhatWeDo), `lg:grid-cols-[minmax(0,320px)_1fr]` (CareersPurpose).

Horizontal card carousels use `flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar` with cards at `w-[78%] sm:w-[55%] lg:w-[360px]`.

### 3.7 Footer

`surface-dark bg-geat-dark`, `.section-container .section-y-sm`, laid out on a 12-column grid from `md`:

| Column | Span | Content |
| --- | --- | --- |
| Brand | `md:col-span-3` | Logo (`brightness-0 invert`), "Follow Us", LinkedIn + Emploitic marks |
| Links | `md:col-span-5` | Three `<nav>` groups — About GEAT, Company, Careers |
| Contact | `md:col-span-4` | Phone, email, address; separated by `border-t` on mobile, `border-l` + `pl-8` from `md` |

Below: a `border-t border-border pt-6` legal row — copyright left, Cookies / Terms / Privacy / Preferences right, stacking to a column below `md`.

**Floating-widget lane.** The footer reserves bottom padding so the fixed FAB and chat launcher never land on the legal row — `pb-12` by default, `pb-28 sm:pb-32` on `/careers/*`. The arithmetic is documented in [floatingWidgetLane.ts](src/components/floatingWidgetLane.ts):

| Route | Viewport | Offset + size | Stack |
| --- | --- | --- | --- |
| default | <640px | `bottom-6` + `h-11` | 68px |
| default | ≥640px | `bottom-8` + `h-12` | 80px |
| `/careers/*` | <640px | `bottom-24` + `h-11` | 140px |
| `/careers/*` | ≥640px | `bottom-28` + `h-12` | 160px |

**If you move a widget, move it in that file** — the offsets and the reserve must stay in agreement.

### 3.8 Alignment rules

- Body copy and headings are **left-aligned**. Centred text appears only in short CTA bands and the 404 page.
- Hero content is bottom-aligned (`items-end`) by default; `PageHero` accepts `align="center"`.
- The breadcrumb, the `<h1>` and the hero copy all share the `.section-container` left edge — `Breadcrumb` overrides `.tap-target`'s centring with `justify-start` specifically so the first crumb stays flush.
- Card grids stretch by default; stat cards use `flex flex-col justify-between` so figures sit on a common baseline.

### 3.9 Z-index scale

| Layer | Value |
| --- | --- |
| Skip link (focused) | `z-[100]` |
| Fixed header, mobile drawer, ScrollToTop FAB | `z-50` |
| Drawer backdrop, careers sub-nav | `z-40` |
| Hero carousel controls | `z-20` |
| Hero content | `z-10` |

---

## 4. Responsive design

### 4.1 Breakpoints

Tailwind defaults, unmodified:

| Prefix | Min-width | Occurrences | Role |
| --- | --- | --- | --- |
| *(base)* | 0 | — | **Mobile-first default** |
| `sm:` | 640px | 150 | Large phone / small tablet |
| `md:` | 768px | 71 | Tablet |
| `lg:` | 1024px | 178 | **Desktop — the main layout switch** |
| `xl:` | 1280px | 4 | Rarely used |
| `2xl:` | 1536px | 0 in code | Only as the container cap (set to 1400px) |

In practice this is a **four-tier system**: base → `sm` → `md` → `lg`.

Four raw media queries exist outside the Tailwind prefixes:

| Query | Location | Purpose |
| --- | --- | --- |
| `min-width: 1024px` | [index.css:245](src/index.css#L245) | `body` padding-top 4rem → 5rem (header height) |
| `max-width: 767px` | [index.css:439](src/index.css#L439) | Shorter, faster scroll reveals |
| `max-width: 767px` | [index.css:775](src/index.css#L775) | Mobile polish block (see below) |
| `max-width: 479px` | [index.css:487](src/index.css#L487) | `.btn-cta` goes full-width |

Plus capability queries: `@media (pointer: coarse)`, `@media (hover: hover) and (pointer: fine)`, `@media (prefers-reduced-motion: reduce)`.

JavaScript uses one breakpoint — `MOBILE_BREAKPOINT = 768` in [use-mobile.tsx](src/hooks/use-mobile.tsx).

### 4.2 Desktop (≥1024px)

- Full horizontal nav with hover-triggered dropdown and mega-menu panels
- Header 80px; body reserves 5rem
- Gutters `px-12` (48px); content capped at 1400px
- Grids at their widest — `lg:grid-cols-3`, `lg:grid-cols-4`, asymmetric fixed-track layouts
- Hero `min-h-[370px]` with `pt-28 pb-20`
- Hover affordances active (`hover: hover` gate satisfied): CTA sweep, card lift, image scale, nav underlines
- Decorative extras appear (e.g. the large `ArrowUpLeft` in StatsSection is `hidden lg:flex`)

### 4.3 Tablet (640–1023px)

- **Still uses the mobile drawer** — the nav switch is at `lg` (1024px), not `md`
- Header 64px; body reserves 4rem
- Gutters `px-6` (24px)
- Grids collapse to two columns (`sm:grid-cols-2`, `md:grid-cols-2`); the footer's 12-column grid engages at `md`
- Hero `min-h-[340px]` with `pt-24 pb-16`
- Full horizontal hero scrim returns at `sm` (`sm:to-geat-dark/45`)
- Carousel cards at `w-[55%]`; slide labels become visible (`hidden … sm:block`)

### 4.4 Mobile (<640px)

- Hamburger → right-side drawer at 86vw
- Gutters `px-5` (20px)
- Single-column grids throughout
- Hero `min-h-[300px]` with `pt-20 pb-12`; scrim holds an 85% opacity floor
- `.btn-cta` becomes full-width below 480px
- Carousel cards at `w-[78%]` — the next card peeks, signalling scrollability
- Footer contact column separates with `border-t` instead of `border-l`

The dedicated mobile-polish block ([index.css:775-804](src/index.css#L775-L804)) adds:

```css
h1, h2, h3, p, li, a { overflow-wrap: break-word; }   /* no layout-breaking long words */
h1, h2, h3           { text-wrap: balance; letter-spacing: -0.01em; }

input, select, textarea { font-size: 16px; min-height: 46px; }  /* no iOS zoom-on-focus */
textarea                { min-height: 120px; }

a[href]:not(.btn-cta), button:not(.btn-cta) { touch-action: manipulation; }  /* no 300ms delay */

.rounded-2xl { border-radius: 0.875rem; }             /* softer cards */
```

### 4.5 Typography changes across breakpoints

| Element | Mobile | Desktop |
| --- | --- | --- |
| Hero headline | `clamp(1.5rem, 7vw, 3rem)` — **fluid, no breakpoints** | same clamp, resolves to 48px |
| Section `<h2>` | `text-3xl` (30px) | `lg:text-4xl` (36px), sometimes `lg:text-5xl` |
| Hero subtitle | `text-base` (`text-sm` on the slider) | `lg:text-lg` |
| Stat figure | `text-4xl` / `text-5xl` | `lg:text-5xl` / `lg:text-7xl` |
| Slide label | hidden | `sm:block`, `lg:text-sm` |

### 4.6 Spacing changes across breakpoints

Handled entirely by the three rhythm classes (`.section-y-sm` 40/56/64, `.section-y` 56/80/96, `.section-y-lg` 72/96/128) plus `.section-head` (32/40/48) and the container gutter (20/24/48). Card padding steps `p-6 → lg:p-8`; grid gaps step `gap-10 → lg:gap-16` or `gap-12 → lg:gap-20`.

### 4.7 Image resizing

Every content image is `object-cover` inside a fixed-aspect box, so the box drives layout and the image crops. Ratios in use: `aspect-[4/3]` (6), `aspect-square` (4), `aspect-[3/4]` (2), `aspect-[16/9]` (2), `aspect-video`, `aspect-[4/5]`, `aspect-[21/9]`, `aspect-[16/10]`.

Product renders on transparent backgrounds use `object-contain p-8 bg-secondary` instead, so the object is never cropped.

Hero images are declared `1920×1080` and always `object-cover object-center`; individual slides can override the focal point (`objectPosition: "50% 62%"`).

### 4.8 Grid-to-column transitions

| Component | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| Footer | 1 col | 12-col (3/5/4) at `md` | same, `lg:gap-12` |
| Footer link groups | 2 cols | 3 cols at `sm` | 3 cols |
| Nav panel | *(drawer accordion)* | — | 2 cols at `sm`, 3 at `lg` |
| StatsSection | 1 col | 2 cols at `sm` (inner) | 2 cols at `lg` (outer) |
| WhatWeDo | stacked | stacked | `lg:grid-cols-[340px_1fr]` |
| Product/news card grids | 1 col | 2 cols | 3–4 cols |

---

## 5. Pages

All routes are declared in [App.tsx](src/App.tsx). `ScrollToTop` resets scroll position on every route change.

### `/` — Home ([Index.tsx](src/pages/Index.tsx))

**Purpose** — brand statement and gateway to every section.

**Structure** — `Navbar` → `HeroSlider` → `AnnouncementsSection` → `WhoWeAre` → `ValuesScroll` → `WhatWeDo` → `StatsSection` → `EngineersSection` → `CareersSection` → `Newsletter` → `Footer`.

| Section | What it does |
| --- | --- |
| `HeroSlider` | 3-slide autoplay carousel, 5s per slide, full control bar |
| `AnnouncementsSection` | Dated feature cards (Careers / News / Grid initiative) |
| `WhoWeAre` | Two-column intro — copy left, image right, `lg:gap-20` |
| `ValuesScroll` | Alternating light/navy value panels with photography |
| `WhatWeDo` | Category list + horizontal product-card carousel |
| `StatsSection` | Navy band, three count-up stat cards (2014 / 200,000 m² / 140+) |
| `EngineersSection` | Featured employee story + supporting story cards |
| `CareersSection` | Three recruitment entry-point cards |
| `Newsletter` | Navy rounded panel with subscribe form |

**CTAs** — per-slide primary CTA (`Discover GEAT`, `Explore Our Solutions`, `Explore Grid Solutions`), "More products and services", careers cards, newsletter subscribe.

**UX notes** — the only page with `HeroSlider`; the only page without a `Breadcrumb`.

### `/about` ([About.tsx](src/pages/About.tsx))

Company story. `PageHero` (breadcrumb "About us") → narrative section on `bg-background` → navy section → `bg-card` section → `bg-background` section → `section-y-lg` navy closing CTA → `Newsletter`. Uses `KickerLabel` for section eyebrows and `reveal` on headings.

### `/leadership` ([Leadership.tsx](src/pages/Leadership.tsx))

Executive team. `PageHero` (title "Our" + highlight) → leadership grid on `bg-background` → a `section-y-lg` navy statement band with a `text-4xl md:text-6xl uppercase` display heading → `Newsletter`.

### `/products-services` ([ProductsServices.tsx](src/pages/ProductsServices.tsx))

Portfolio index. `PageHero` → one section per category (Products, Technologies & Solutions, Services) with card grids → navy `section-y-lg` closing CTA. Cards link to `/products-services/:slug`.

### `/products-services/:slug` ([ProductDetail.tsx](src/pages/ProductDetail.tsx))

Per-offering detail, driven by [products.ts](src/data/products.ts). Nine slugs: `gas-turbines`, `steam-turbines`, `auxiliaries`, `control-systems`, `grid-solutions`, `digital-solutions`, `repair-services`, `power-plant-maintenance`, `aero-derivative-turbine-services`.

Structure: `PageHero` (breadcrumb = product name) → overview + `showcaseImage` → navy `section-y-sm` **key-figures band** using `CountUpValue` → `bg-secondary` spec tables → item groups (image grids or MLI-coded tables) → related-products band → closing CTA.

The data model supports `paragraphs`, `keyFigures`, `specColumns`, `groups` (with `table` / `codeLabel` for MLI-referenced piping items) and `showcaseContained` (renders `object-contain` for transparent product renders).

### `/news` ([News.tsx](src/pages/News.tsx))

Newsroom. `PageHero` → featured article → article grid → `#milestones` timeline on `bg-secondary/40` → `#careers` cross-promotion on `bg-secondary` → navy `section-y-lg` closing CTA → `Newsletter`. Includes a keyword filter with an empty state ("No positions match your search. Try a different keyword.").

### `/contact` ([Contact.tsx](src/pages/Contact.tsx))

**Purpose** — sales and support enquiries.

`PageHero` (title "How Can We" + highlight) → `#contact-form` (`scroll-mt-20`) with the main form → a contacts section listing Career opportunities / Media contacts / Visit us → `Newsletter`.

The form uses `FormField` + zod, includes a Radix `<Select>`, a `<RadioGroup>` for communications consent, and a `<Textarea>`. On submit it shows a `Submitting…` label on a disabled button and reports the outcome with a **toast**.

### `/careers` ([Careers.tsx](src/pages/Careers.tsx))

Recruitment landing page. `PageHero` → intro on `bg-background` (with an `text-6xl sm:text-7xl lg:text-8xl` accent display numeral) → navy purpose/mission band → `PurposeMission` / `FindYourPath` → `#opportunities` job board on `bg-muted/40` → navy `section-y-lg` closing CTA.

Carries `CareersSubNav`, `GeniChat` and `ApplicationStatusModal` — as do all `/careers/*` routes.

### `/careers/jobs` ([JobSearch.tsx](src/pages/JobSearch.tsx))

Full job board. A navy `section-y-sm` header band (breadcrumb + `<h1>`) instead of a `PageHero`, then `OpenJobsBoard` on `bg-muted/40 section-y-lg`. Filters are validated with zod and confirmed by toast.

### `/careers/jobs/:slug` ([JobDetails.tsx](src/pages/JobDetails.tsx))

Single vacancy. `PageHero` (breadcrumb = job title, subtitle = summary) → a two-column body: About the Role / Responsibilities / Requirements / Qualifications / What GEAT Offers on the left, a "Position details" sidebar on the right. Missing slugs render a "Position not found" `<h1>`. Primary CTA → `/careers/jobs/:slug/apply`.

### `/careers/jobs/:slug/apply` ([JobApplication.tsx](src/pages/JobApplication.tsx))

Application form. `PageHero` titled `Apply for {title}` with a `department · location · type` subtitle. On success the page swaps to a `section-y-lg` confirmation panel with its own `<h1>`. Uses `FormErrorSummary`, the sr-only file picker pattern and the consent checkbox with its 44px overlay. Invalid submits raise a toast: *"Please check the form / Some required fields need your attention."*

### `/careers/submit-cv` ([SpontaneousApplication.tsx](src/pages/SpontaneousApplication.tsx))

Open application for candidates with no matching vacancy. Same form architecture, grouped into "Your details" and a second `<h2>` group.

### `/careers/how-to-apply` ([HowToApply.tsx](src/pages/HowToApply.tsx))

Five-step recruitment process. `PageHero` → numbered step section → "Tips for your application" on `bg-secondary/50 section-y-lg`.

### `/careers/life-at-geat` ([LifeAtGeat.tsx](src/pages/LifeAtGeat.tsx))

Culture and benefits. The most photography-heavy page (8 images with intrinsic dimensions). Alternates `section-y` on default ground, navy bands (one with an uppercase `text-primary` heading), and `bg-secondary/50`, closing on a navy CTA.

### `/careers/faq` ([CareersFaq.tsx](src/pages/CareersFaq.tsx))

Two navy `surface-dark` sections of accordion Q&A (the second uses `section-y pt-0` to butt against the first).

### `/careers/fields/:slug` ([CareerField.tsx](src/pages/CareerField.tsx))

Per-discipline career page. `PageHero` → intro → `bg-muted/40` sections → `#field-jobs` (`scroll-mt-24`) filtered `OpenJobsBoard` → closing section.

### `*` — 404 ([NotFound.tsx](src/pages/NotFound.tsx))

Minimal centred page: `text-4xl font-bold` "404" and a link home. **No `Navbar` or `Footer`.**

### Navigation relationships

```
/  ──┬─→ /about ──→ /leadership
     ├─→ /products-services ──→ /products-services/:slug ──┐
     │                              ↑                       │
     │                              └───── related ─────────┘
     ├─→ /news
     ├─→ /careers ──┬─→ /careers/jobs ──→ /careers/jobs/:slug ──→ …/apply
     │              ├─→ /careers/how-to-apply
     │              ├─→ /careers/life-at-geat
     │              ├─→ /careers/faq
     │              ├─→ /careers/fields/:slug
     │              └─→ /careers/submit-cv
     └─→ /contact
```

Breadcrumbs render on every page except `/` and `/404`. Footer legal links (Cookies, Terms, Privacy, Preferences) all currently resolve to `/contact`.

---

## 6. Components

### Layout components

#### `Navbar`

**Purpose** — primary site navigation. **Appearance** — fixed, opaque `bg-card`, logo left, links centre-right, language switcher and hamburger right. **Variants** — `showSearchJobs` prop adds a "Search Jobs" amber pill (desktop) and retargets the drawer's bottom CTA. **States** — dropdown open/closed, drawer open/closed, per-item hover. **Responsive** — full nav at `lg`, drawer below. **Used on** — every page except 404.

#### `CareersSubNav`

**Purpose** — second-level nav for the careers tree. **Appearance** — sticky bar, `from-muted to-background` gradient, `shadow-sm`. **States** — current page marked by `aria-current`, weight *and* an amber underline. **Responsive** — horizontally scrollable with hidden scrollbar. **Used on** — all `/careers/*` routes.

#### `Footer`

**Purpose** — site map, contact details, legal. **Appearance** — `surface-dark` navy, 12-column grid, inverted logo. **Variants** — bottom padding switches between `pb-12` and `pb-28 sm:pb-32` depending on whether the route carries the chat launcher. **Used on** — every page except 404.

#### `PageHero`

**Purpose** — the single hero design for every route except `/`.

**Props** — `title`, `highlight`, `subtitle`, `image`, `imageAlt`, `breadcrumb`, `breadcrumbTrail`, `primaryCta`, `secondaryCta`, `children`, `align`.

**Appearance** — full-bleed image, two scrims, breadcrumb, `<h1>` with an optional `.text-highlight` trailing phrase, subtitle, up to two CTAs, all inside a `max-w-3xl` block with an amber left bar.

**Variants** — `align="bottom"` (default) / `align="center"`; primary CTA is `.btn-cta`, secondary is `.btn-cta-outline-light`.

**Behaviour** — hero image is `loading="eager"` with `fetchpriority="high"` (lowercase DOM attribute — React 18.3 does not recognise React 19's camelCase `fetchPriority`). Headline, subtitle and CTAs stagger in via `reveal-delay-1/2/3`.

#### `HeroSlider`

**Purpose** — the homepage carousel. Three slides, 5000ms each, matched to the `slide-progress` keyframe.

**Controls** — prev, a labelled slide-selector row (compact bars on mobile, labels + progress rails from `sm`), next, and a pause/play toggle.

**Playback model** — a three-state machine:

| State | Meaning |
| --- | --- |
| `auto` | Nobody pressed the toggle; advances unless a transient hold applies |
| `playing` | User pressed Play — explicit intent outranks transient holds |
| `paused` | User pressed Pause (WCAG 2.2.2); only Play resumes |

Transient holds: pointer resting **on the control bar** (not the whole hero — a cursor parked anywhere above the fold used to freeze it indefinitely), and keyboard focus anywhere inside the hero. Touch pointers are excluded from the hover hold because an emulated `pointerenter` with no matching leave froze the deck permanently.

Everything user-visible — the progress rail, the `aria-live` politeness, the toggle icon and its label — derives from `autoplaying` (whether the deck is *actually* advancing), never from the toggle flag alone.

**Reduced motion** — autoplay is disabled entirely, the progress rail renders as a static full bar, and the toggle is hidden.

**Keyboard** — ← / → move between slides and shift focus to the target button.

#### `Breadcrumb`

**Purpose** — trail from Home to the current page. **Appearance** — `mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground`, chevron separators, current page `font-medium text-foreground` with `aria-current="page"`. **Targets** — every crumb is a `.tap-target` (≥44×44); the 16px chevron with 8px gaps keeps adjacent targets 32px apart. Base classes route through `cn()` so a caller's `className` genuinely wins.

### Content components

#### `KickerLabel`

**Purpose** — **the one eyebrow label for the whole site.** Previously hand-rolled ~26 times with **seven** different letter-spacings (0.18–0.35em), three sizes and a mix of weights.

Now: **one spacing (0.2em), one weight (`font-heading font-semibold`)**, with three props:

| Prop | Values |
| --- | --- |
| `size` | `sm` (11px, in-card) · `md` (`text-xs`, default) · `lg` (`text-sm`, hero) |
| `tone` | `primary` (section kicker) · `muted` (quieter meta) |
| `ornament` | `none` · `rule` (short leading amber rule) · `arrow` (L-shaped SVG) |

`tone="primary"` resolves to `text-muted-foreground [.surface-dark_&]:text-primary` — muted words on light (5.61:1) with the brand surviving in the ornament, real orange on navy (6.64:1). This must be a variant rather than a token swap because one call site can render on both grounds (`ValuesScroll` alternates light and navy panels through a single `<KickerLabel>`).

Callers pass the **English source string**; the component translates it. `className` is for **placement only** — never colour, size or tracking.

#### `FormField`

**Purpose** — the one field primitive for every form. See [§2.16](#216-forms). Owns label binding, `aria-invalid`, `aria-describedby`, `aria-required`, the control shape and the permanent error region. `control` selects `"input"` | `"textarea"` | `"custom"`; the control itself is supplied as a render function so the same primitive wraps native inputs, shadcn `<Input>`, Radix `<SelectTrigger>` and an sr-only file picker.

#### `RevealOnScroll`

Mounted once in `App.tsx`. A single `IntersectionObserver` (`threshold: 0.12`, `rootMargin: "0px 0px -60px 0px"`) that adds `.is-visible` to any `.reveal` element, then unobserves it. A `MutationObserver` rescans on DOM changes so React-inserted content is covered.

#### `CountUpValue`

Animates the first number inside a figure string ("288 MW", "60.4%", "~2x"), preserving prefix and suffix. Honours `prefers-reduced-motion` by landing on the final figure immediately. Used for product key figures.

#### `ScrollToTop`

Two jobs: resets `window.scrollTo(0,0)` on every route change, and renders a back-to-top FAB once scrolled past 50% of viewport height.

FAB: `h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-brand text-brand-foreground shadow-lg`, hovering to `bg-accent text-accent-foreground` over 300ms. Position comes from `SCROLL_TOP_POSITION`.

**Unmounted while hidden, not faded.** It is mounted above `<Routes>`, so with `opacity-0 pointer-events-none` it stayed in the tab order and became **tab stop #1 on all 11 routes**.

#### `LanguageSwitcher`

EN/FR menu-button. Follows the menu-button pattern: opening moves focus to the checked option, `Escape` closes and returns focus to the trigger, click-outside closes, options are `role="menuitemradio"` with `aria-checked`. Selection persists to `localStorage` and sets `document.documentElement.lang`.

#### `GeniChat`

Floating chat assistant on `/careers/*`. Launcher uses the `chat-pop-in` / `chat-bounce` / `chat-ring` animation set. Non-modal (`modal: false` in `useDialog`) — Escape closes and focus is restored, but Tab may leave freely, because the page behind stays usable.

#### `ApplicationStatusModal`

Modal for tracking a submitted application by reference + email (zod-validated). Renders a 4-step progress indicator: Application Submitted → Under HR Review → Interview → Final Decision. Opened by a custom `geat:application-status` window event dispatched from `CareersSubNav`.

#### `OpenJobsBoard`

Filterable vacancy list with search, faceted filters, pagination and per-discipline icons. Disabled pagination controls use `disabled` + `opacity`. Empty state: *"No positions match your filters."*

#### Homepage sections

| Component | Shape |
| --- | --- |
| `AnnouncementsSection` | Dated feature cards with category, excerpt and CTA |
| `WhoWeAre` | `lg:grid-cols-2` copy/image split, `gap-12 lg:gap-20` |
| `ValuesScroll` | Alternating light/navy value panels with photography and bullet points |
| `WhatWeDo` | Category list (left) + snap-scroll photo-card carousel (right) |
| `StatsSection` | Navy band, `lg:grid-cols-2`, three count-up cards, one `size="lg"` |
| `EngineersSection` | Featured story + supporting story cards |
| `CareersSection` | Three recruitment cards with staggered `reveal-delay-*` |
| `Newsletter` | Navy `rounded-2xl` panel, `shadow-2xl`, amber left bar, blurred colour orbs |
| `SubscribeSection` | `bg-primary/10 section-y-sm` strip with a single `.btn-cta` |
| `OurValues` | Icon + title + description value grid |
| `CareersPurpose` | Exports `PurposeMission` and `FindYourPath`; uses `section-y pb-0` where the section closes on a full-bleed image band |

### `src/components/ui/` — shadcn primitives

47 files wrapping Radix UI. Actively used: `button`, `badge`, `card`, `input`, `textarea`, `label`, `select`, `radio-group`, `checkbox`, `accordion`, `dialog`, `tooltip`, `toast`/`toaster`, `sonner`, `form`, `separator`, `skeleton`, `sheet`, `progress`, `tabs`.

These are the **unmodified shadcn baseline** apart from token rebinding (`bg-brand` in place of `bg-primary` for fills, `text-accent` for link variants). Several — `calendar`, `chart`, `carousel`, `command`, `menubar`, `resizable`, `sidebar`, `input-otp`, `pagination`, `context-menu`, `hover-card`, `drawer` — are scaffolding that the application does not currently import.

> **⚠ Recommended** — prune the unused `ui/` primitives, or document them as an intentional library. They currently make the component surface look ~2× larger than it is.

---

## 7. UX guidelines

### Implemented today

**Clear navigation.** A five-item primary nav with no hidden levels — the mega menu shows every category side by side, with no hover-to-switch and nothing concealed. Breadcrumbs on every non-home page. A sticky second-level bar for the careers tree. `aria-current` marks the current page in both.

**Visual hierarchy.** One `<h1>` per page, in the hero. Section headings are `text-3xl lg:text-4xl font-bold`; eyebrows sit above them at 11–14px `tracking-[0.2em]`. Body copy is `text-muted-foreground`, capped at `max-w-2xl`/`max-w-3xl` for measure. Emphasis comes from weight and ground changes, not from colour alone.

**Consistent spacing.** Three section-rhythm classes, one container, one gutter scale. Ad-hoc `py-*` on top-level sections is not used anywhere.

**CTA placement.** Every page ends with a navy `section-y-lg` closing CTA band. Heroes carry up to two CTAs (primary amber pill + outline secondary). Card grids place their CTA in the card footer. The careers sub-nav ends with a persistent "All Jobs" pill.

**User feedback.**
- Toasts (`useToast` + `<Toaster>`, plus Sonner) on contact submit, job-filter changes and invalid application submits
- Submit buttons disable and relabel (`Submitting…`)
- Successful application submits swap the page to a confirmation panel
- Carousel progress rails show elapsed time on the current slide
- Disabled carousel arrows use `opacity-40 cursor-not-allowed` plus the real `disabled` attribute

**Hover / focus states.** A global focus floor that nothing may remove:

```css
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 3px;
}
```

Components may restyle it (`.btn-cta` uses a 3px ring at 3px offset) but must never delete it — anything setting `outline-none` must supply its own ring. Hover effects are gated behind `@media (hover: hover) and (pointer: fine)` so touch devices never get stuck in a hover state.

**Error states & form validation.** zod schemas per form. The invalid affordance is never colour alone — the border **doubles to 2px** *and* an `AlertCircle` icon appears next to the message. `aria-invalid`, `aria-describedby` and `aria-required` are wired by `FormField`. The error region is **always rendered** (empty when valid) because a live region inserted at the same moment as its content is not announced. On submit, `FormErrorSummary` renders a focusable `role="alert"` list linking to each bad field.

**Touch-friendly mobile interactions.** A 44px floor for every control on coarse pointers:

```css
@media (pointer: coarse) {
  :where(button, [role="button"], a[href], summary,
         input[type="checkbox"], input[type="radio"]) { min-height: var(--tap); }
  :where(p, li, .prose) a[href], :where(.link-inline) { min-height: 0; }
}
```

> `:where()` is **mandatory** here. An earlier version used bare element selectors — `a[href]:not(.link-inline)` scores (0,1,1) and therefore **beat** every Tailwind `min-h-*` utility at (0,1,0). The rule stopped being a floor and became a cap: the drawer's `min-h-14` rows rendered at 44px. With `:where()` (zero specificity) the utility always wins.
>
> There is deliberately **no `display` rule** in that block — forcing display on arbitrary controls fights `hidden` / `lg:hidden` / `flex`, and a previous version broke the responsive nav on touch laptops by showing the hamburger and the desktop nav simultaneously.

Inline prose links are exempt (the WCAG 2.5.8 inline exception). `.tap-target` wraps small marks (a 14px dot, a 16px icon) in a 44×44 box without changing how they look.

**Readability.** 16px minimum on mobile form controls (prevents iOS zoom-on-focus). `leading-relaxed` on body copy. `text-wrap: balance` on headings. `overflow-wrap: break-word` on mobile text.

**Loading states.** A `<Skeleton>` primitive exists. All page content is bundled statically, so there is **no async data fetching** — the only genuine loading state on the site is the form-submitting state described above.

### ⚠ Recommended

These are **not** implemented:

1. **Add a pause control to the `WhatWeDo` carousel.** It auto-advances every 1000ms via `setInterval`. It correctly bails out under `prefers-reduced-motion` and pauses on hover/touch, but there is **no persistent pause/stop mechanism** — WCAG 2.2.2 requires one for content that auto-starts and runs longer than 5 seconds. `HeroSlider` already implements the right pattern; reuse it. A 1000ms interval is also unusually fast for reading card titles — consider 4000–5000ms.
2. **Give `<img>` intrinsic dimensions everywhere.** Only 12 of ~20 files that render images pass `width`/`height`, so the rest are exposed to cumulative layout shift.
3. **Add route-level error boundaries.** A render error in any page currently unmounts the whole tree.
4. **Give the footer's "Company" group distinct destinations.** Products, Technologies & Solutions and Services all resolve to `/products-services`.
5. **Point the legal links at real pages.** Cookies, Terms, Privacy Notice and Preferences all resolve to `/contact`.
6. **Add a visible skip-link target outline.** The skip link works, but `#main` receives no focus styling when jumped to.

---

## 8. Images & assets

### Folder structure

```
public/
  favicon.png              64×64 site icon
  robots.txt

src/assets/
  geat-logo.png            505×337 — the primary mark
  geat-logo-header.png     header variant
  geat-logo-chat.jpg       chat-avatar variant
  geat-logo-new.png        alternate mark
  hero-*.{png,jpg,jpeg}    homepage slider backgrounds
  *-hero.{png,jpg,jpeg}    per-page hero photography
  value-*.{png,jpg,jpeg}   values section photography
  story-*.jpg              engineer story cards
  careers-*.jpg            careers photography
  announcement-*.jpg       announcement cards
  engineer-*.{png,jpg}     people photography
  ps/                      products & services
    *.{png,jpg}            top-level product/technology images
    auxiliary/             17 MLI-coded auxiliary piping renders
    repair/                6 repair-service component photographs
```

> **`src/assets/ps/auxiliary/` must not be renamed to `aux`.** `AUX` is a reserved Windows device name and Git cannot create such a directory on Windows — the files fail to check out and Vite reports unresolvable imports. All 17 images and their imports use `auxiliary`.

### Image usage

Images are **imported as ES modules**, never referenced by string path:

```tsx
import gasTurbineHero from "@/assets/gas-turbine-hero.png";
```

Vite then hashes, bundles and fingerprints them. Product imagery is centralised in the `psImages` map in [products.ts](src/data/products.ts) so a single import site serves every consumer.

### Aspect ratios & dimensions

| Context | Ratio | Recommended source |
| --- | --- | --- |
| Hero (page + slider) | 16:9 | **1920×1080** — declared in `heroStyles.ts` |
| Product carousel card | 3:4 | ≥720×960 |
| Content / story card | 4:3 | ≥1200×900 |
| Portrait / avatar | 1:1 | ≥800×800 |
| Wide feature band | 21:9 | ≥1920×823 |
| Video thumbnail | 16:9 | ≥1280×720 |

Every image sits in a fixed-ratio box with `object-cover` (34 uses) unless it is a transparent product render, which uses `object-contain p-8 bg-secondary` (7 uses) so nothing is cropped.

### Logo usage

| Placement | Treatment |
| --- | --- |
| Header | `h-12 lg:h-16 w-auto`, `alt="GEAT Logo"`, `width={505} height={337}` |
| Mobile drawer | `h-9 w-auto` |
| Footer | `h-16 sm:h-20 w-auto` with **`brightness-0 invert`** to render white on navy |

The footer instance carries the full accessible name — `alt="GEAT — General Electric Algeria Turbines"`.

### Icons

lucide-react only. See [§2.14](#214-icons).

### Optimisation approach

| Technique | Status |
| --- | --- |
| Bundler hashing & fingerprinting | ✅ Vite handles all `src/assets` imports |
| `loading="lazy"` | ✅ 39 of 40 images |
| `loading="eager"` + `fetchpriority="high"` | ✅ exactly one — the LCP hero image |
| `decoding="async"` | ✅ 41 uses |
| Intrinsic `width`/`height` | ⚠️ partial — 12 files |
| Broken-image fallback | ✅ global, see below |
| Modern formats (WebP/AVIF) | ❌ none |
| Responsive `srcset` / `sizes` | ❌ none |

**Broken-image guard** — [imageFallback.ts](src/lib/imageFallback.ts) installs one capture-phase `error` listener on `document` (the `error` event does not bubble), covering every image including those React adds later. A failed image is marked `data-img-failed` and [index.css:712](src/index.css#L712) paints a neutral GEAT-toned diagonal-hatch panel **at the element's own size**, so a missing file never reflows the layout or shows a browser broken-image glyph. Images with no `alt` also get `role="presentation"` so a decorative failure stays silent for screen readers.

### ⚠ Recommended

1. **Serve WebP/AVIF with `srcset`.** Several source PNGs are very large — `hero-bg-1.png` (2.2 MB), `gas-turbine-hero.png` (2.6 MB), `life-at-geat-hero.png` (2.7 MB), `careers-hero-turbine.png` (2.6 MB). The production build ships them as-is.
2. **Replace the Open Graph image.** [index.html](index.html) points `og:image` and `twitter:image` at the **64×64 favicon** while declaring `twitter:card = summary_large_image`. Social previews will render a tiny or blank image; supply a 1200×630 card.
3. **Add `width`/`height` to the remaining images** to eliminate layout shift.
4. **Consolidate the four logo files.** `geat-logo.png`, `geat-logo-header.png`, `geat-logo-new.png` and `geat-logo-chat.jpg` coexist; only the first and last are imported.

---

## 9. Animations & interactions

### Registered keyframes & animations

From [tailwind.config.ts](tailwind.config.ts):

| Utility | Keyframe | Duration / easing |
| --- | --- | --- |
| `animate-accordion-down` | `height: 0 → var(--radix-accordion-content-height)` | `0.2s ease-out` |
| `animate-accordion-up` | reverse | `0.2s ease-out` |
| `animate-slide-progress` | `width: 0% → 100%` | `5s linear` |
| `animate-fade-in-up` | `opacity 0→1`, `translateY(20px)→0` | `0.6s ease-out forwards` |
| `animate-fade-in` | `opacity 0→1`, `translateY(8px)→0` | `0.35s ease-out` |

From [index.css](src/index.css):

| Utility | Effect | Duration / easing |
| --- | --- | --- |
| `.reveal` → `.is-visible` | `opacity 0→1`, `translateY(28px)→0` | `0.9s cubic-bezier(0.22, 1, 0.36, 1)` |
| `.reveal-delay-1…4` | staggered entry | `0.1s / 0.2s / 0.3s / 0.4s` |
| `.animate-ken-burns` | `scale(1)→scale(1.12)` + drift | `18s ease-out forwards` |
| `.animate-float-slow` | drifting translate + `scale(1.05)` | `14s ease-in-out infinite` |
| `.animate-marquee` | `translateX(0 → -50%)` | `30s linear infinite` |
| `.animate-spin-slow` | full rotation | `14s linear infinite` |
| `.animate-title-reveal` | fade + rise + `blur(6px)→0` | `0.8s cubic-bezier(0.22, 1, 0.36, 1)` |
| `.surface-dark .text-highlight` | amber shimmer sweep | `6s linear infinite` |
| `.cta-pulse` | expanding halo | `2.4s ease-in-out`, `0.6s` delay |
| `.chat-pop-in` | scale-and-settle entry | `0.7s cubic-bezier(0.22, 1, 0.36, 1)` |
| `.chat-bounce` | 6px vertical bob | `2.4s ease-in-out`, `0.8s` delay, infinite |
| `.chat-ring` | expanding 18px ring | `2s ease-out`, `0.8s` delay, infinite |
| `.tilt-card:hover` | `rotateY(-4deg) rotateX(2deg) translateY(-6px)` | `0.5s cubic-bezier(0.22, 1, 0.36, 1)` |
| `.card-aura:hover` | `translateY(-8px)` + pulsing amber glow | `2.4s ease-in-out infinite` |
| `.card-ripple:active` | radial ripple `scale(0)→scale(2.5)` | `0.5s ease-out forwards` |

**The signature easing is `cubic-bezier(0.22, 1, 0.36, 1)`** (ease-out-quint) — used by reveals, CTA colour transitions, icon slides, tilt and pop-in. The CTA sweep uses a sharper `cubic-bezier(0.77, 0, 0.18, 1)`.

### Hover effects

| Element | Effect |
| --- | --- |
| `.btn-cta` | Blue sweep fills L→R (0.55s), label switches to `accent-foreground` (0.5s), lifts 2px, shadow deepens |
| CTA icons (`.btn-cta svg`, `.icon-cta`) | `translateX(4px)` over 0.35s; `translateX(8px) scale(0.92)` on `:active` |
| Nav trigger | 2px amber underline grows `w-0 → w-full` over 300ms; chevron rotates 180° |
| Nav panel link | Background `hover:bg-muted/50`, arrow fades and slides in over 200ms |
| Footer link | Leading amber rule grows `w-0 → w-3` with matching margin |
| Photo card | Image `scale(1.05)` over **700ms** |
| Stat card | `-translate-y-1` over 500ms |
| Social mark | Border and fill switch to `bg-brand` |
| ScrollToTop FAB | `bg-brand → bg-accent` over 300ms |

All hover transforms sit behind `@media (hover: hover) and (pointer: fine)` where they belong to `.btn-cta`.

### Scroll animations

`RevealOnScroll` mounts a single `IntersectionObserver` (`threshold: 0.12`, `rootMargin: "0px 0px -60px 0px"`) that adds `.is-visible` and then unobserves. Elements opt in with `className="reveal"` plus an optional `reveal-delay-1..4`.

**On mobile (<768px) reveals are tuned down** — travel drops from 28px to 16px, duration from 0.9s to 0.6s, and all four delays collapse to a single 0.05s, so content never feels missing on a small screen.

Count-up animations (`StatsSection`, `CountUpValue`) use their own `IntersectionObserver` at `threshold: 0.4` and animate with `requestAnimationFrame` on an **easeOutCubic** curve over 1800–2000ms.

### Carousels

| Carousel | Mechanism |
| --- | --- |
| `HeroSlider` | Cross-fade, `transition-opacity duration-1000`. 5s per slide via one `setTimeout`; the visible progress is a **pure CSS animation**, not a 100ms React tick. Pausing freezes it via `animationPlayState` and resumes with the remaining budget. |
| `WhatWeDo` | Native scroll-snap (`snap-x snap-mandatory`) with `scrollBy({ behavior: "smooth" })`. Progress bar tracks `scrollLeft / (scrollWidth - clientWidth)`, floored at 15% width. |

### Menu animations

Desktop panel: `animate-in fade-in slide-in-from-top-2 duration-300 ease-out` (tailwindcss-animate). Drawer: `slide-in-from-right duration-300 ease-out`, backdrop `fade-in duration-300`. Drawer accordion: `fade-in slide-in-from-top-1 duration-200`.

### Page transitions

**None.** Route changes are instant; `ScrollToTop` resets scroll to the top. Perceived transition comes from `.reveal` elements animating in as the new page's content enters the viewport.

### Reduced motion

One global block honours the preference for **all** animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```

The `.reveal` override is essential — without it, suppressing the transition would leave content stranded at `opacity: 0`.

JavaScript checks the preference independently where an animation is script-driven: `HeroSlider` (disables autoplay and subscribes to `change`), `StatsSection` and `CountUpValue` (land on the final figure), `WhatWeDo` (skips the auto-advance interval).

---

## 10. Accessibility

### Implemented today

**Semantic HTML.** `<header>`, `<nav>`, `<main id="main">`, `<section>`, `<footer>`, `<aside>` are used for their real meaning. Each `<nav>` carries a distinguishing `aria-label` — Primary, Mobile, Breadcrumb, Footer, Careers. Heading order runs `<h1>` (hero, one per page) → `<h2>` (sections) → `<h3>` (cards). Footer column headings are real `<h2>` elements, not styled `<div>`s. Lists are `<ul>`/`<li>`.

**Skip link** — first focusable element on every page:

```css
.skip-link { @apply sr-only; }
.skip-link:focus-visible {
  @apply not-sr-only fixed left-4 top-4 z-[100] rounded-md bg-primary px-4 py-3
         font-heading text-sm font-semibold text-primary-foreground shadow-lg;
}
```

**Keyboard navigation.**
- Global `:focus-visible` outline that components may restyle but never remove
- `Escape` closes dropdowns, the language menu, the drawer and all dialogs
- Focus returns to the trigger on every close
- Dropdown panels and the drawer are **unmounted while closed**, so no invisible tab stops exist (a prior version parked 11 in the header and made a hidden FAB tab stop #1 on all 11 routes)
- Arrow keys move between carousel slides
- `FormErrorSummary` links focus each invalid control and scrolls it to centre

**`useDialog` — one dialog primitive.** Before it existed there were four hand-rolled focus traps with four different focusable selectors, three different focus-restore points, two locking body scroll and two not — and every `Escape` handler was a bubble-phase `document` listener, so **one keypress closed every open dialog at once**. `useDialog` maintains a stack in which only the topmost dialog responds to `Escape`, and distinguishes:

| Mode | Behaviour |
| --- | --- |
| `modal: true` | Tab trapped inside, body scroll locked. For genuinely blocking surfaces with a backdrop. |
| `modal: false` | Escape closes and focus is restored, but Tab may leave freely — trapping Tab in a non-modal surface strands keyboard users. Used by `GeniChat`. |

Focus is restored **only if it is still inside the closing dialog**, so a user who has already moved on is never yanked back.

**Focus states.** 2px `--ring` outline at 2px offset globally; 3px at 3px offset on `.btn-cta`. `--ring` is surface-aware (`--brand-fill-edge` on light, `28 97% 70%` — 8.2:1 — on navy).

**Alt text.** Meaningful images carry descriptive alt (`"GEAT auxiliary skid module assembly"`). Decorative images carry `alt=""` — including product-carousel images, because the `<h3>` beneath repeats the same words and duplicating it triggered axe's `image-redundant-alt` on three nodes. Hero slider images are `alt=""` with `aria-hidden="true"` on their wrappers, since the `<h1>` carries the meaning. 39 icons carry `aria-hidden="true"`.

**Colour contrast.** Every semantic token has a measured ratio recorded in [index.css:24-33](src/index.css#L24-L33), and the whole light/dark token split exists to satisfy them. Highlights:

| Pairing | Ratio |
| --- | --- |
| `--muted-foreground` on light ground | 5.61:1 |
| `--accent` as text on light | 4.96:1 (worst ground) |
| `--brand-fill` + `--geat-dark` label | 6.64:1 |
| `--brand-fill-edge` vs page / card | 3.74:1 / 4.01:1 |
| `--primary` as text on navy | 6.64:1 ground, 4.74:1 card |
| `--muted-foreground` on navy | 6.6:1 ground, 7.68:1 card |
| `--accent` on navy | 6.96:1 |

**State is never carried by colour alone** (WCAG 1.4.1). Three worked examples:

- `WhatWeDo` category list — the selected row was once amber-only. It now reads through **weight** (`font-bold` vs `font-semibold`), **ink strength** (`text-foreground` vs `text-muted-foreground`) *and* an amber chevron.
- `CareersSubNav` — the current page uses `aria-current`, `font-semibold` **and** an amber underline.
- Invalid form fields — the border **doubles to 2px** and an `AlertCircle` icon appears alongside the message.

`.text-highlight` deserves special mention: it was previously `.text-gradient-orange`, which clipped an amber gradient to the glyphs and set `color: transparent`. Because the computed colour was transparent, **automated contrast checks skipped the node entirely** while readers saw 2.27:1 pixels. It is now surface-aware — solid `--accent` on light (4.96:1), the amber shimmer only on navy. It was renamed because on light grounds it is neither a gradient nor orange, *"and a name that lies is how the failure survived this long."*

**ARIA usage.** `aria-label` (49), `aria-hidden` (39), `aria-selected` (11), `aria-invalid` (7), `aria-describedby` (7), `aria-current` (7), `aria-required` (6), `aria-expanded` (6), `aria-controls` (5), `aria-roledescription` (4), `aria-modal` (4), `aria-live` (4), `aria-haspopup` (4), `aria-labelledby` (3), `aria-pressed` (2), `aria-checked` (2). Roles: `dialog` (4), `group` (4), `alert` (2), `menuitemradio` (2), `presentation` (2), plus `menu`, `region`, `navigation`, `separator`, `link`.

The carousel uses the full pattern: `aria-roledescription="carousel"` on the section, `aria-roledescription="slide"` on the content group, and `aria-live` switching to `"polite"` **only when autoplay is stopped** — announcing every slide of a running carousel would be noise.

**Mobile accessibility.** The 44px coarse-pointer floor (WCAG 2.5.5/2.5.8), `.tap-target` for small marks, 16px form controls to prevent iOS zoom-on-focus, `touch-action: manipulation` to remove the 300ms tap delay, and `h-[100dvh]` on the drawer so it accounts for mobile browser chrome.

**Motion.** `prefers-reduced-motion` honoured globally in CSS and independently in JS for script-driven animation. The carousel offers an explicit pause control (WCAG 2.2.2).

**Language.** `document.documentElement.lang` is updated when the locale changes.

### ⚠ Recommended improvements

1. **`WhatWeDo` needs a pause control** — see [§7](#-recommended). This is the one clear WCAG 2.2.2 gap left on the site.
2. **Run automated audits in CI.** `axe-core` and `@playwright/test` are already dependencies and [playwright.config.ts](playwright.config.ts) is configured against `localhost:8080`, but no `e2e/` specs exist and [src/test/example.test.ts](src/test/example.test.ts) is a placeholder. An axe sweep over all 17 routes would lock in the work already done.
3. **Give `#main` a focus target style** so skip-link users get visible confirmation of the jump.
4. **Audit heading order on the longest pages** (`LifeAtGeat`, `ProductDetail`) for skipped levels.
5. **Add `aria-label` or a visually-hidden `<h2>` to each landmark `<section>`** so screen-reader users can navigate between them by region.
6. **Verify contrast over photography for any new hero image.** The scrim guarantees an 85% ground floor below `sm`, but from `sm` up the sweep thins to `/45` on the right — new images with bright right-hand areas should be checked.
7. **Test with a real screen reader.** The ARIA is thorough and clearly considered, but there is no evidence in the repo of NVDA/VoiceOver verification.

---

## 11. UI/UX rules for future development

### Colour

1. **Never hardcode a hex or `hsl()` literal in a component.** Use the semantic token. If no token fits, add one to `:root` **and** to `.surface-dark`.
2. **Never use orange as text on a light ground.** `--primary` on light is a fill/ornament colour. For text use `text-muted-foreground` (meta), `text-accent` (links) or `text-foreground` with an amber arrow glyph.
3. **To place content on navy, add `surface-dark` to the container** — never override colours per instance. Every token inside retargets automatically.
4. **When you add a token, define it on both surfaces.** A light-only `--destructive` measures 2.3:1 on navy; state colours must retarget too.
5. **Never change a brand identity value to fix a contrast bug.** Change the semantic token that points at it.
6. **Never signal state with colour alone.** Add weight, an icon, an underline or a position change.

### Typography

7. **Reuse the existing type ramp.** Headings `text-3xl lg:text-4xl font-bold`; body `text-base`/`text-sm`; meta `text-xs`. Do not introduce new arbitrary sizes without a reason you can state.
8. **Do not add a font family.** DM Sans for headings and UI, Inter for body.
9. **Prefer semantic weights** (`font-semibold`, `font-bold`) over numeric ones.
10. **Use `<KickerLabel>` for every eyebrow.** Never hand-roll an uppercase tracked label — that is exactly how seven different letter-spacings appeared. Pass `size` / `tone` / `ornament`; `className` is for **placement only**.
11. **Keep the linear ornament vocabulary.** Rules, underlines, bars, arrows. Round marks are reserved for state.

### Spacing & layout

12. **Every top-level `<section>` uses `.section-y-sm`, `.section-y` or `.section-y-lg`.** Never an ad-hoc `py-*`.
13. **Every section's content goes inside `.section-container`.** Do not invent a different max-width or gutter.
14. **Use `.section-head` for the gap between a heading block and its content.**
15. **Do not add a spacer `<div>` for the fixed header.** `body { padding-top }` owns that. Keep `h-16 lg:h-20`, `4rem`/`5rem` and `top-16 lg:top-20` in lockstep.
16. **Heroes must use `heroStyles.ts`.** Do not set a fixed height — padding is the constant, height is the leftover.

### Components

17. **Reuse before you build.** `PageHero`, `KickerLabel`, `FormField`, `Breadcrumb`, `Card`, `Button`, `Badge` cover most needs.
18. **If a call site needs a shape a shared component lacks, add the variant to the component** so the whole site moves — do not fork it locally.
19. **Every form field goes through `FormField`.** Never hand-roll a label/input pair; that is how `/contact` ended up with a different control and a different error affordance from the application forms.
20. **Every dialog uses `useDialog`.** Never hand-roll a focus trap or an `Escape` listener.
21. **Use `.btn-cta` for primary calls to action** and the `<Button>` primitive inside forms and dialogs.
22. **Unmount overlays while closed** — do not hide them with `opacity-0` / `max-h-0`, which leaves live tab stops in the page.

### Responsive

23. **Design mobile-first**, adding `sm:` / `md:` / `lg:`. Do not introduce new breakpoints — the site is a four-tier system.
24. **The nav switch is at `lg` (1024px)**, not `md`. Tablets get the drawer.
25. **Keep desktop and mobile equivalent in content.** Hiding a whole section on mobile is not a responsive strategy; the two experiences should differ in layout, not in what is available.
26. **Gate hover effects behind `@media (hover: hover) and (pointer: fine)`** so touch devices never stick in a hover state.
27. **Never let the page scroll horizontally.** Wide content (tables, card rows) scrolls inside its own `overflow-x-auto` container, usually with `.no-scrollbar`.

### Radius, shadow, border

28. **Match the surrounding radius.** Pills and FABs `rounded-full`; controls `rounded-md`/`rounded-lg`; content cards `rounded-2xl`; photo cards `rounded-sm`. Avoid new arbitrary values.
29. **Prefer the Tailwind shadow scale.** If you need a bespoke shadow, express it with tokens (`hsl(var(--geat-dark) / 0.28)`), never a raw colour.
30. **Use `border-border` for dividers, `border-input` for controls, `border-brand-edge` for amber-edged controls.**

### Accessibility (non-negotiable)

31. **Never remove a focus ring.** Anything setting `outline-none` must supply its own.
32. **Every interactive control reaches 44×44 on touch.** Wrap small marks in `.tap-target`.
33. **Every image needs a decision:** meaningful → descriptive `alt`; decorative or duplicated by adjacent text → `alt=""`.
34. **Every icon-only control needs an `aria-label`.** Every decorative icon needs `aria-hidden="true"`.
35. **Anything that auto-animates for more than 5 seconds needs a pause control**, and must honour `prefers-reduced-motion`.
36. **One `<h1>` per page.** Do not skip heading levels.
37. **New animation must be covered by the reduced-motion block** — and must not leave content stranded at `opacity: 0` when suppressed.

### Content & i18n

38. **Pass English source strings to `t()`**; add the French translation in [src/i18n/fr/](src/i18n/fr/).
39. **Do not pre-translate before passing to a component that translates internally** (`KickerLabel`, `PageHero`, `Breadcrumb` all call `t()` themselves).
40. **Import images as ES modules.** Never reference a string path — Vite must see the import to hash and bundle the file.
41. **Never create a directory named `aux`, `con`, `prn`, `nul`, `com1–9` or `lpt1–9`** — these are reserved Windows device names and will not check out on Windows.

### Before you ship

42. **`npm run build` must pass**, and `npx tsc --noEmit` must be clean.
43. **Check the change on a light ground and inside `surface-dark`** if it touches anything reusable.
44. **Check at 390px, 768px and 1440px.**
45. **Tab through it.** Then tab through it again with the dropdown or dialog open.

---

## 12. Design tokens reference

### Colour — light ground (`:root`)

| Token | Value | Hex | Usage |
| --- | --- | --- | --- |
| `--geat-dark` | `215 30% 16%` | `#1D2735` | Navy brand ground |
| `--geat-orange` | `32 100% 54%` | `#FF9013` | Logo amber (fills/ornaments) |
| `--geat-orange-dark` | `32 100% 38%` | `#C26700` | Amber border tone |
| `--geat-blue` | `200 98% 32%` | `#026CA2` | Logo blue (accent) |
| `--geat-blue-light` | `200 90% 62%` | `#47BBF5` | Blue on navy |
| `--geat-light` | `216 20% 96%` | — | Light neutral |
| `--brand-fill` | `var(--geat-orange)` | `#FF9013` | Primary button fill |
| `--brand-fill-foreground` | `var(--geat-dark)` | `#1D2735` | Label on brand fill |
| `--brand-fill-edge` | `32 100% 38%` | `#C26700` | Brand control border |
| `--background` | `220 13% 97%` | — | Page ground |
| `--foreground` | `215 25% 17%` | — | Body text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card surface |
| `--card-foreground` | `215 25% 17%` | — | Text on cards |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Popover surface |
| `--popover-foreground` | `215 25% 17%` | — | Text in popovers |
| `--primary` | `var(--brand-fill)` | `#FF9013` | Fills, ornaments, active marks |
| `--primary-foreground` | `var(--geat-dark)` | `#1D2735` | Text on primary |
| `--primary-shimmer` | `32 100% 38%` | `#C26700` | Highlight sweep stop |
| `--secondary` | `216 20% 96%` | — | Alternating section band |
| `--secondary-foreground` | `215 25% 17%` | — | Text on secondary |
| `--muted` | `216 16% 93%` | — | Muted surface, rails |
| `--muted-foreground` | `215 14% 40%` | — | Secondary text (5.61:1) |
| `--accent` | `var(--geat-blue)` | `#026CA2` | Links, hover sweep |
| `--accent-foreground` | `0 0% 100%` | `#FFFFFF` | Text on accent |
| `--destructive` | `0 72% 42%` | — | Errors, required marks |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on destructive |
| `--success` | `152 62% 32%` | — | Success states |
| `--success-foreground` | `0 0% 100%` | `#FFFFFF` | Text on success |
| `--border` | `218 15% 91%` | — | Hairlines, dividers |
| `--input` | `216 14% 90%` | — | Form control borders |
| `--ring` | `var(--brand-fill-edge)` | `#C26700` | Focus ring |

### Colour — dark ground (`.surface-dark`)

| Token | Value | Usage |
| --- | --- | --- |
| `--background` | `var(--geat-dark)` | Navy ground |
| `--foreground` | `0 0% 100%` | Text on navy (14.11:1 on card) |
| `--card` | `215 28% 18%` | Raised card on navy |
| `--card-foreground` | `0 0% 100%` | Text on dark card |
| `--popover` | `215 28% 18%` | Popover on navy |
| `--popover-foreground` | `0 0% 100%` | Text in dark popover |
| `--primary` | `var(--geat-orange)` | **Real orange text** (6.64:1) |
| `--primary-foreground` | `var(--geat-dark)` | Text on primary |
| `--primary-shimmer` | `36 100% 76%` | Brighter shimmer stop |
| `--secondary` | `215 25% 24%` | Secondary surface |
| `--secondary-foreground` | `0 0% 100%` | Text on secondary |
| `--muted` | `215 25% 24%` | Muted surface |
| `--muted-foreground` | `214 18% 76%` | Secondary text (6.6:1) |
| `--accent` | `var(--geat-blue-light)` | Links on navy (6.96:1) |
| `--accent-foreground` | `215 30% 12%` | Text on accent |
| `--destructive` | `0 80% 70%` | Errors on navy (5.39:1) |
| `--destructive-foreground` | `215 30% 12%` | Text on destructive |
| `--success` | `152 60% 70%` | Success on navy (9.57:1) |
| `--success-foreground` | `215 30% 12%` | Text on success |
| `--border` / `--input` | `215 20% 32%` | Dividers, control borders |
| `--ring` | `28 97% 70%` | Focus ring on navy (8.2:1) |

### Geometry, spacing & motion

| Token | Value | Usage |
| --- | --- | --- |
| `--radius` | `0.5rem` | Base radius — drives `rounded-sm/md/lg` |
| `--space-section` | `3.5rem` (56px) | Section padding, mobile |
| `--space-section-sm` | `5rem` (80px) | Section padding, ≥640px |
| `--space-section-lg` | `6rem` (96px) | Section padding, ≥1024px |
| `--tap` | `44px` | Minimum pointer target (WCAG 2.5.5/2.5.8) |

| Derived utility | Value |
| --- | --- |
| `.section-container` | `max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12` |
| `.section-y-sm` | `py-10 sm:py-14 lg:py-16` (40/56/64) |
| `.section-y` | `py-14 sm:py-20 lg:py-24` (56/80/96) |
| `.section-y-lg` | `py-[4.5rem] sm:py-24 lg:py-32` (72/96/128) |
| `.section-head` | `mb-8 sm:mb-10 lg:mb-12` (32/40/48) |
| `.hero-headline` | `clamp(1.5rem, 7vw, 3rem)`, DM Sans 800, uppercase |
| Header height | `h-16 lg:h-20` (64/80) with `body { padding-top: 4rem / 5rem }` |
| Hero min-height | `300 / 340 / 370px` |
| Hero image | `1920 × 1080` (16:9) |

| Motion constant | Value |
| --- | --- |
| Signature easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| CTA sweep easing | `cubic-bezier(0.77, 0, 0.18, 1)` |
| Reveal | `0.9s` desktop / `0.6s` mobile |
| Reveal delays | `0.1 / 0.2 / 0.3 / 0.4s`, collapsing to `0.05s` on mobile |
| Slide duration | `5000ms` (`SLIDE_DURATION`, matched to `slide-progress`) |
| Menu / panel transitions | `300ms` |

### Utility classes worth knowing

| Class | Purpose |
| --- | --- |
| `.surface-dark` | Retargets every semantic token to the navy ground |
| `.section-container` / `.section-y*` / `.section-head` | Layout rhythm |
| `.hero-headline` | The display headline type |
| `.text-scrim` | 85%-floor gradient for a text panel over a photograph |
| `.text-highlight` | The emphasised word of a display heading (surface-aware) |
| `.btn-cta` / `.btn-cta-outline` / `.btn-cta-outline-light` | Primary & secondary CTAs |
| `.tap-target` | Wraps a small mark in a 44×44 hit box |
| `.link-inline` | Inline prose link (accent underline, exempt from the tap floor) |
| `.skip-link` | Skip-to-content link |
| `.reveal` + `.reveal-delay-1..4` | Scroll-triggered entrance |
| `.no-scrollbar` | Horizontal scroll row without a visible scrollbar |
| `.tilt-card` / `.card-aura` / `.card-ripple` | Optional card hover behaviours |
| `.bg-dot-pattern` / `.bg-grid-pattern` | Subtle textures for CTA bands |
| `.floating-widget` | Marks a fixed widget so `body.menu-open` can hide it |

---

## 13. Development

### Getting started

```sh
npm i
npm run dev        # http://localhost:8080
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port **8080** |
| `npm run build` | Production build into `dist/` |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |

### Stack

React 18.3 · TypeScript 5.8 · Vite 5.4 (`@vitejs/plugin-react-swc`) · Tailwind CSS 3.4 · shadcn/ui on Radix · react-router-dom 6.30 · TanStack Query 5 · zod 3 · react-hook-form 7 · lucide-react · Vitest · Playwright.

`@/*` resolves to `src/*` ([vite.config.ts](vite.config.ts)).

### Where things live

| Path | Contents |
| --- | --- |
| [src/index.css](src/index.css) | **Design tokens, base layer, component & utility classes** — start here |
| [tailwind.config.ts](tailwind.config.ts) | Token → Tailwind bindings, fonts, keyframes |
| [src/components/](src/components/) | Application components |
| [src/components/ui/](src/components/ui/) | shadcn primitives |
| [src/components/heroStyles.ts](src/components/heroStyles.ts) | Shared hero geometry |
| [src/components/floatingWidgetLane.ts](src/components/floatingWidgetLane.ts) | Fixed-widget offsets and the footer reserve |
| [src/pages/](src/pages/) | One file per route |
| [src/data/](src/data/) | Product and careers content |
| [src/i18n/](src/i18n/) | Language context and the French dictionary |
| [src/hooks/](src/hooks/) | `useDialog`, `useIsMobile`, `useReveal`, `useToast` |
| [src/lib/](src/lib/) | `cn()` helper, global image fallback |
| [src/assets/](src/assets/) | All imagery |

### A note on the code comments

Several files carry long explanatory comment blocks — [index.css](src/index.css), [heroStyles.ts](src/components/heroStyles.ts), [KickerLabel.tsx](src/components/KickerLabel.tsx), [FormField.tsx](src/components/FormField.tsx), [useDialog.ts](src/hooks/useDialog.ts), [floatingWidgetLane.ts](src/components/floatingWidgetLane.ts), [Navbar.tsx](src/components/Navbar.tsx), [imageFallback.ts](src/lib/imageFallback.ts).

**These are not clutter — they are the design rationale**, usually recording a specific measured failure and the reasoning that produced the current shape. Read the comment before changing the code beneath it, and update it if you change the decision.
