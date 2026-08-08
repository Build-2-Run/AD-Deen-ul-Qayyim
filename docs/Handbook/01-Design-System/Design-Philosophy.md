# ADQ Design System Foundation

## Design Philosophy
The visual foundation of AD-Deen-ul-Qayyim (ADQ) is built on the principles of **calmness, focus, respect, and spaciousness**. The platform must feel premium and timeless, avoiding the noisy, attention-seeking patterns of social media or the utilitarian dryness of traditional academic databases. The design must instantly convey authenticity and reverence while removing all friction between the user and the knowledge.

---

## 1. Typography Hierarchy
Typography is the primary medium of ADQ. It must be exceptionally legible, elegant, and culturally respectful.

- **Arabic Typography:** Must use highly legible, traditional Naskh or Uthmani scripts (e.g., KFGQPC Uthmanic Script, Amiri) that support precise diacritics (Tashkeel). Arabic text must always be generous in scale and line height to prevent visual crowding of vowels.
- **English/Latin Typography:** Should use a clean, modern, and highly legible sans-serif (e.g., Inter, SF Pro, Roboto) for UI elements, paired with a sophisticated serif (e.g., Merriweather, Lora) for long-form translations and academic text to evoke a premium, book-like feel.
- **Hierarchy:** Strict structural scaling (H1 through H6) must be maintained to organize dense theological information effortlessly.

## 2. Spacing and Grid System
- **Spaciousness:** Generous whitespace (macro-whitespace) is critical to the "calm" philosophy. Content must breathe.
- **Grid:** A responsive 12-column grid forms the underlying structure. The Reader module operates on a focused, narrow central column for optimal reading length (approx. 60-75 characters per line), while dashboards and calculators expand to utilize wider layouts.
- **Spacing Scale:** Built on a strict 4px/8px baseline (e.g., 4, 8, 12, 16, 24, 32, 48, 64) to ensure mathematical harmony and vertical rhythm.

## 3. Color Philosophy
Colors are not chosen randomly; they are derived from nature and historic Islamic manuscripts, updated for a modern context.
- **Primary:** Deep Emerald/Forest Greens and Gold/Brass accents. These convey heritage, life, and value.
- **Neutral Core:** Vast expanses of off-white (e.g., Sand/Parchment) in Light Mode, and deep, low-contrast blacks/slates in Dark Mode to reduce eye strain during prolonged reading.
- **Semantic Colors:** Reserved strictly for status (e.g., Red for errors, Blue for informational links, Green for success/verification).
- **Avoidance:** Harsh pure white (`#FFFFFF`) and pure black (`#000000`) are avoided to prevent high-contrast glare.

## 4. Border Radius, Shadows, and Elevation
- **Border Radius:** Subtle and organic. Mild rounding (4px-8px) on interactive elements (buttons, inputs) and slightly larger (12px-16px) on major structural cards to soften the UI without feeling overly playful or toy-like.
- **Shadows & Elevation:** Used exclusively to indicate z-axis depth and interaction hierarchy. 
  - *Base:* Flat, grounded knowledge surfaces.
  - *Elevated:* Dropdowns, sticky headers, and floating action buttons use soft, diffused, and wide shadows to separate them from the primary text gracefully.

## 5. Icon & Illustration Philosophy
- **Icons:** Minimal, mono-weight, and highly recognizable (e.g., Lucide or Feather icons). They must support navigation quietly without demanding attention.
- **Illustrations:** When used, they must be purposeful, structural, or educational (e.g., isometric diagrams of mosques, geometric data visualizations for Zakat). Decorative "filler" graphics are strictly prohibited to maintain academic seriousness.

## 6. Dark Mode Philosophy
Dark mode is treated as a primary citizen, essential for late-night study and Taraweeh reflections.
- It is not simply an inversion of colors. It relies on a carefully calibrated scale of deep greys/blues to preserve legibility and contrast ratios.
- Golden and Emerald accents are desaturated slightly to prevent them from "vibrating" against dark backgrounds.

## 7. Accessibility Principles (A11y)
The ADQ platform serves a global, diverse Ummah.
- **Contrast:** All text must meet WCAG 2.1 AA contrast requirements minimum.
- **Screen Readers:** Every non-decorative element must have ARIA labels.
- **Focus States:** Keyboard navigation must have highly visible, intentionally designed focus rings (not relying on default browser styling) to ensure respectful access for all.
