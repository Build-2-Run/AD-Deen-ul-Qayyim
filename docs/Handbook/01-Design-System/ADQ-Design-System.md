# ADQ Design System — Single Source of Truth

> This document is the **canonical, authoritative** specification for every visual
> and interaction decision in AD-Deen ul-Qayyim. When any other document, mockup,
> or line of code disagrees with this file, **this file wins** — and the other
> should be corrected.
>
> - **Concrete values live in two places that must stay in sync:** the runtime
>   tokens in `app/src/styles/index.css`, and the definitions here. When you add
>   or change a token, update **both**.
> - Components live in `app/src/design/`. Adding a component requires an entry in
>   the [Components](#12-components--component-apis) section below.
> - Companion narrative docs — `Design-Philosophy`, `Visual-Language`, the `UX/`
>   folder — explain the *why*. **This** doc defines the *what* (the exact spec).
> - **Supersedes** the old `Design-Tokens.md` (names-only) and consolidates the
>   duplicated Motion and Accessibility docs.

Last reconciled against code: 2026-07-26.

---

## 0. Decisions to confirm (flagged, not silently chosen)

These are design/brand calls; I've proposed professional defaults but they're
yours to confirm:

1. **Brand primary color.** `Design-Philosophy` specifies **Emerald primary +
   Gold accent**, but `index.css` currently sets **primary = gold (`#c98a1a`)**.
   This spec adopts the *documented intent*: **Emerald = primary, Gold = accent.**
   → Requires updating `index.css` primary to emerald. Confirm or keep gold-primary.
2. **Long-form serif.** Philosophy suggests a serif for long translations; code
   uses Outfit/Inter only. This spec keeps Outfit/Inter and marks serif *optional*.
3. **Font loading.** Outfit/Inter/Amiri are referenced but must be actually loaded
   (self-hosted via `@fontsource`, recommended). Confirm hosting approach.

---

## 1. Design tokens — architecture

Tokens are **CSS custom properties** defined in `app/src/styles/index.css`,
exposed to Tailwind v4 via `@theme`, and consumed as `var(--token)` or Tailwind
utilities (`bg-[var(--primary)]`, `text-[var(--text-secondary)]`).

- **Theming mechanism:** light is `:root`; dark is the `.dark` class on a root
  ancestor (toggled by the theme switcher). Every color token has a light and a
  dark value.
- **Naming:** semantic first (`--primary`, `--surface`, `--text-secondary`),
  never raw (`--emerald-600`) in components. Components reference *semantic*
  tokens so re-theming never touches component code.
- **Never hard-code** hex/px in components — always a token or Tailwind scale value.

---

## 2. Colors

### 2.1 Brand palette (raw scales — reference only, not used directly in components)

**Emerald (Primary — heritage, life):**
`50 #ecfdf5` · `100 #d1fae5` · `200 #a7f3d0` · `300 #6ee7b7` · `400 #34d399` ·
`500 #10b981` · `600 #059669` · `700 #047857` · `800 #065f46` · `900 #064e3b`

**Gold / Brass (Accent — value, reverence):**
`300 #f5c75d` · `400 #e6b84d` · `500 #dfa032` · `600 #c98a1a` · `700 #a06f14`

**Slate neutrals (UI surfaces & text):** Tailwind `slate` scale
(`#f8fafc … #0f172a`). Pure `#000`/`#fff` are avoided for large areas per the
calm principle.

### 2.2 Semantic tokens (what components actually use)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | `#047857` *(emerald-700)* | `#34d399` *(emerald-400)* | Primary actions, brand, active nav |
| `--primary-foreground` | `#ffffff` | `#0c101b` | Text/icon color **on** `--primary` (keeps buttons AA in both themes) |
| `--accent` | `#dfa032` *(gold-500)* | `#f5c75d` | Highlights, hover on primary, emphasis |
| `--background` | `#f8fafc` | `#0c101b` | App canvas |
| `--surface` | `#ffffff` | `#101625` | Cards, panels, elevated layers |
| `--border` | `rgba(0,0,0,0.10)` | `rgba(255,255,255,0.08)` | Hairlines, dividers |
| `--text-primary` | `#0f172a` | `#ffffff` | Body & headings |
| `--text-secondary` | `#475569` | `rgba(255,255,255,0.65)` | Secondary, captions, hints |
| `--success` | `#10b981` | `#34d399` | Verified, saved, success |
| `--warning` | `#f59e0b` | `#fbbf24` | Cautions |
| `--error` | `#ef4444` | `#f87171` | Errors, validation |
| `--info` | `#3b82f6` | `#60a5fa` | Informational links/notes |

> **Implementation note (applied 2026-07-26):** `index.css` now sets light
> `--primary: #047857` + `--primary-foreground: #ffffff`; dark `--primary: #34d399`
> + `--primary-foreground: #0c101b`; `--accent` stays gold. The `Button` primary
> variant uses `--primary-foreground` for its text so it passes AA in both themes.

### 2.3 Contrast (WCAG 2.1 AA — verify on change)

Target **4.5:1** for body text, **3:1** for large text (≥24px/≥19px-bold) and UI.
Known-good pairs: `--text-primary` on `--background`/`--surface` (both modes);
white on `--primary` emerald-700 `#047857` (~5.1:1 ✓); dark text `#0c101b` on the
dark-mode `--primary` `#34d399` (✓). **Gold (`#dfa032`) fails 4.5:1 on white** —
use gold only for large text, borders, icons, or accents, **never for small body
text**.

---

## 3. Typography

### 3.1 Font families (tokens)

| Token | Family | Role |
|---|---|---|
| `--font-display` / `--font-heading` | **Outfit**, sans-serif | Display & headings (H1–H6) |
| `--font-body` | **Inter**, sans-serif | UI & body text (Latin) |
| `--font-arabic` | **Amiri**, serif (Naskh) | All Arabic script |
| *(optional)* long-form serif | Lora / Source Serif 4 | Long translations (flagged, not yet in code) |

**Loading:** self-host via `@fontsource/{outfit,inter}` + `@fontsource/amiri`;
`font-display: swap`. Amiri must ship with full tashkeel glyph coverage.

### 3.2 Type scale (rem-based — the Tailwind scale the code uses)

| Token | Size | Line-height | Typical use |
|---|---|---|---|
| `xs` | 0.75rem (12px) | 1rem | Captions, meta |
| `sm` | 0.875rem (14px) | 1.25rem | Secondary, labels |
| `base` | 1rem (16px) | 1.5rem | **Body default** |
| `lg` | 1.125rem (18px) | 1.75rem | Lead paragraph, H4 |
| `xl` | 1.25rem (20px) | 1.75rem | H3 |
| `2xl` | 1.5rem (24px) | 2rem | H2 |
| `3xl` | 1.875rem (30px) | 2.25rem | H1 |
| `4xl` | 2.25rem (36px) | 2.5rem | Display |
| `5xl` | 3rem (48px) | 1 | Arabic hero only |

**Heading levels (from `Heading` component):** H1=`3xl` · H2=`2xl` · H3=`xl` ·
H4=`lg` · H5=`base` · H6=`sm`; default weight **bold (700)**.
**Weights:** normal 400 · medium 500 · semibold 600 · bold 700.

### 3.3 English typography
- Body: Inter, `base`, weight 400, `--text-primary`.
- Optimal reading measure: **60–75 characters** (≈ `max-w-3xl` / 48rem) in the Reader.
- Headings: Outfit; keep hierarchy strict (never skip levels for styling).

### 3.4 Arabic typography
- Font: **Amiri** (Naskh); always `dir="rtl"`, right-aligned.
- **Line-height: loose (~1.9–2.1)** — mandatory so tashkeel (vowel marks) never
  collide. The `ArabicText` component enforces `leading-loose` + `dir="rtl"`.
- **Scale is larger** than Latin: `ArabicText` default is `2xl`; sizes `sm`→`5xl`.
  Qur'anic hero text uses `4xl`/`5xl`.
- Never letter-space Arabic; never force uppercase; never apply Latin font fallback.
- Mixed Arabic+Latin lines use bidi isolation (see §8 RTL).

---

## 4. Spacing

**4px base unit.** Scale (Tailwind, rem): `1`=0.25rem(4px) · `2`=8 · `3`=12 ·
`4`=16 · `5`=20 · `6`=24 · `8`=32 · `10`=40 · `12`=48 · `16`=64 · `24`=96.
The `Stack`/`Flex` `space` prop = `n × 0.25rem` (e.g. `space={4}` → 16px).
Favor **generous macro-whitespace** (the calm principle): section gaps ≥ `8`(32px).

---

## 5. Radius

| Token | Value | Use |
|---|---|---|
| `sm` | 0.125rem (2px) | Small chips |
| `md` | 0.375rem (6px) | **Buttons, inputs (default)** |
| `lg` | 0.5rem (8px) | Cards, panels, surfaces |
| `full` | 9999px | Avatars, pills, IconButton |

Mild rounding only — soft, not toy-like (per philosophy).

---

## 6. Shadows / Elevation

| Token | Value | Use |
|---|---|---|
| `none` | — | Grounded base surfaces |
| `low` | `shadow-sm` (0 1px 2px rgba(0,0,0,.05)) | Subtle lift (list items) |
| `medium` = `--shadow-medium` | `0 4px 16px rgba(0,0,0,0.10)` | Cards, dropdowns, sticky headers |
| `high` *(add)* | `0 12px 32px rgba(0,0,0,0.12)` | Dialogs, floating panels |

> **Deprecate `--shadow-glass` / the glow** (`0 0 35px rgba(224,169,34,.1)`) and
> the `Surface` `elevation="glass"` variant — the glow contradicts the
> "calm, never distracting" principle. Replace glass usages with `medium`/`high`.

---

## 7. Icons

- Library: **Lucide** (mono-weight, consistent stroke), via the `Icon` wrapper.
- Default size **24px** (nav/inline 20px; large states 48–64px).
- Icons that convey meaning **must** have text or `aria-label`.
- No filled/duotone mixing; no decorative icons that carry no meaning.

---

## 8. RTL / Bidirectionality

- Set `dir="rtl"` at the **node level** for Arabic (the `ArabicText` component
  does this); the shell stays LTR until a full Arabic UI locale ships (future).
- **Use CSS logical properties** — `margin-inline`, `padding-inline`,
  `inset-inline`, `text-align: start/end` — never physical `left/right` — so
  layouts mirror automatically under RTL.
- **Mirror** directional icons (chevrons, back/forward, progress) in RTL.
  **Never mirror**: the Kaaba/Qibla indicators, logos, or media.
- Mixed Arabic + Latin (e.g. "Surah 2:255"): wrap runs with bidi isolation
  (`unicode-bidi: isolate` / `<bdi>`) to prevent number/punctuation reordering.
- Numbers: Western digits by default; Arabic-Indic numerals optional per locale.

---

## 9. Accessibility (WCAG 2.1 AA baseline)

- **Contrast:** 4.5:1 body, 3:1 large text & UI. Verify every token pair on change (§2.3).
- **Keyboard:** every interactive element reachable via `Tab`; logical order
  matching visual/reading order (LTR or RTL). Search opens on `Cmd/Ctrl+K`.
- **Focus:** visible custom focus ring — `ring-2 ring-offset-2` in `--primary`.
  Never remove `outline` without a replacement.
- **Semantics:** real elements (`<button>` vs `<a>`), landmarks (`header/nav/main/
  article`), headings in order. Icon-only controls need `aria-label`.
- **Overlays:** Dialog/Sheet/Search trap focus, restore focus on close, and
  announce (`role="dialog"`, `aria-modal`).
- **Touch targets:** ≥ **44×44px** on mobile, with spacing to avoid mis-taps.
- **Motion:** honor `prefers-reduced-motion` (already enforced globally in
  `index.css`) — degrade to instant/cross-fade.
- **Text scaling:** rem units only (no fixed px heights that clip enlarged text).
- **Arabic:** loose line-height so tashkeel never overlaps (§3.4).

---

## 10. Motion (consolidated — supersedes `Motion.md` + `UX/Motion-System.md`)

**Tokens:** `--transition-essential: 150ms ease-out` · `--transition-helpful:
250ms ease-in-out`.

| Class | Duration | Easing | Examples |
|---|---|---|---|
| **Micro** (feedback) | 100–150ms | ease-out | hover, active press (`scale .97`), color |
| **Macro** (spatial) | 200–300ms | ease-out in / ease-in out | dialogs (fade + `zoom-in-95`), sheets (slide from edge), accordions (height) |

- **Essential** (state change) and **Helpful** (feedback) motion only.
- **Forbidden:** looping, bouncing, shaking, attention-grabbing motion.
- Enter with `ease-out`, exit with `ease-in`. Always respect reduced-motion (§9).

---

## 11. Responsive rules

**Breakpoints (Tailwind):** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536` (px).

**Layout by tier:**
- **Mobile (<768):** single column; **bottom tab bar** (Home/Quran/Search/…);
  panels become **bottom sheets**; nav hides during immersive reading.
- **Tablet (768–1024):** collapsible sidebar or dense top bar; touch targets 44px.
- **Desktop (≥1024):** persistent slim **left sidebar**; contextual panels slide
  in from the right (RTL: from the left).

**Widths:** Reader column `max-w-3xl` (48rem, ~65–75ch); standard content
`max-w-5xl`; dashboards/calculators may go full-width. Grid: 12 columns.
Wide content (tables, graphs) scrolls inside its own `overflow-x:auto` container —
the page body never scrolls horizontally.

---

## 12. Knowledge-level UX — Beginner / Student / Scholar

A knowledge platform must serve three depths from the **same** authenticated node
by adjusting the *presentation layer* only (never the underlying data).

| Level | Shows | Density |
|---|---|---|
| **Beginner** | Plain-language summary, key takeaways, one primary evidence, larger type, guided next-step | Low |
| **Student** | + Qur'anic references, relevant hadith, Asbab al-Nuzul, related topics | Medium |
| **Scholar** | + Full Arabic, isnad/chains, classical opinions (ikhtilaf), cross-references, raw citations, research tools | High |

**Mechanism:** a global **Reading Level** setting (persisted) + an in-Reader level
switcher. Content nodes expose all three layers; components render the layers the
current level permits. This is a first-class design requirement, not an add-on.

---

## 13. Components & Component APIs

All under `@/design`. **Primitives** compose everything — never use a raw `<div>`
for layout. Props below are the real, implemented APIs (extend native HTML attrs;
all accept `className`, `asChild` where noted).

### 13.1 Primitives (`design/primitives`)
| Component | Key props |
|---|---|
| `Box` | native div wrapper (`BoxProps`) |
| `Flex` | `direction` `align` `justify` `wrap` `gap` |
| `Grid` | `cols` `gap` |
| `Stack` | `space?: number\|string` (n×0.25rem), `align: start\|center\|end\|stretch` |
| `Spacer` | flexible gap |
| `Surface` | `elevation: none\|low\|medium\|glass*` · `rounded: none\|sm\|md\|lg\|full` · `interactive?` · `asChild?` *(deprecate `glass`)* |
| `Text` | `variant: primary\|secondary\|accent\|success\|warning\|error\|info\|inherit` · `size: xs…4xl` · `weight: normal\|medium\|semibold\|bold` · `align` |

### 13.2 Typography (`design/typography`)
| Component | Key props |
|---|---|
| `Heading` | `level: 1–6` (auto size/tag), inherits `Text` props |
| `Body`, `SubHeading`, `Caption`, `Label`, `Code` | `Text` props |
| `ArabicText` | `size: sm…5xl` (default `2xl`); forces `dir=rtl`, Amiri, loose leading |
| `TranslationText` | LTR translation styling (`Text` props minus `variant`) |

### 13.3 Components (`design/components`)
| Component | Key props |
|---|---|
| `Button` | `variant: primary\|secondary\|ghost` · `size: sm\|md\|lg\|icon` · `asChild?` |
| `IconButton` | `Button` minus `size` (round, icon-sized) |
| `Input`, `SearchInput` | native input attrs |
| `Badge`, `Tag` | native div attrs (status/label chips) |
| `Tabs`, `Dialog`, `Accordion`, `Tooltip`, `Sheet` | Radix-based, accessible (focus-trap, ARIA) |
| `Loading`, `Skeleton` | `Loading` takes `size?: number` |
| `Icon` | `name: IconName` · `size` · SVG attrs |

### 13.4 Layout (`design/layout`)
`AppShell` · `PageContainer` · `ContentContainer` · `ReaderContainer` · `Section`
· `Sidebar` · `Panel` · `BottomSheet` · `Divider`.

### 13.5 Knowledge patterns (to build — spec, not yet primitives)
- **`ReaderBlock`** — universal node renderer: Arabic (RTL, prominent) + translation
  (LTR) + hover-revealed actions (bookmark/copy/audio) + inline citation triggers.
- **`KnowledgePanel`** — contextual deep-dive; **Sheet** (right) on desktop,
  **BottomSheet** on mobile; never navigates the user away.
- **`EmptyState`** — centered, 48–64px muted icon, H3/H4 title, secondary body,
  primary recovery `Button`. Never a dead end.
- **`Toast`** — bottom-center/right, auto-dismiss 3–5s; never for critical errors.
- **`SearchOverlay`** — `Dialog`, `Cmd/Ctrl+K`, grouped results by domain, fully
  keyboard-navigable, empty state = recent + suggested.

---

## 14. Governance

1. This document is canonical; PRs that change visuals update it in the same change.
2. Token change → edit **both** `index.css` and §1–§10 here.
3. New component → add to `design/` **and** §13, with props, variants, states.
4. Deprecations are marked here (e.g. `glass`/glow) and removed from code over time.
5. Companion docs (`Design-Philosophy`, `Visual-Language`, `UX/*`) must reference
   this file for any concrete value rather than restating it.
