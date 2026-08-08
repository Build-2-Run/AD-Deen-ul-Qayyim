# Accessibility (UX)

AD-Deen-ul-Qayyim must be accessible to all users, adhering to WCAG guidelines as a baseline, and striving for a universally inclusive experience.

## Key Principles

1. **Keyboard Navigation**
   - Every interactive element (links, buttons, dialog triggers) must be reachable via the `Tab` key.
   - Visual focus indicators (focus rings) must be clearly visible and contrast well against the background. Never remove `outline` without providing a custom visual alternative.
   - Logical tab order matching the visual reading order (LTR or RTL depending on the active locale).

2. **Screen Reader Support**
   - Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<button>` vs `<a>`).
   - All icons that convey meaning must have accompanying text or `aria-label` attributes.
   - Dialogs (`KnowledgePanel`, Search Overlay) must trap focus and announce their presence when opened.

3. **Typography & Readability**
   - Text must meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text).
   - Support operating system text scaling. Do not use hardcoded `px` heights that clip enlarged text.
   - Arabic typography requires specific attention to line-height (`leading`) to prevent diacritics (tashkeel) from overlapping.

4. **Touch Targets**
   - On mobile, all interactive elements must have a minimum touch target size of `44x44` pixels.
   - Ensure adequate spacing between interactive elements to prevent accidental taps.

5. **Motion Sensitivity**
   - Respect `prefers-reduced-motion` media queries. When active, disable sliding and zooming animations, reverting to simple crossfades or instant state changes.
