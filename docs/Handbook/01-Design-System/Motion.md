# Motion Guidelines

This document defines the animation philosophy for the ADQ platform. Motion must never be used for decoration or entertainment. Instead, animation serves as a critical structural tool to help the user understand spatial relationships and state changes.

---

## 1. Animation Philosophy
Animations in ADQ must be:
- **Smooth:** Running consistently at 60fps, utilizing GPU-accelerated CSS properties (`transform`, `opacity`).
- **Meaningful:** Every transition must explain where an element came from, or where it is going.
- **Subtle:** Durations should be fast enough to avoid feeling sluggish, but slow enough to be perceived.
- **Premium:** Easing curves should mimic natural physics (e.g., fast entry, gentle deceleration). Linear animations are strictly prohibited as they feel mechanical and cheap.

## 2. Transition Types

### Entrances & Exits (Fade and Slide)
- **Behavior:** Elements entering the viewport (like Dialogs or Tooltips) should fade in and slide slightly upwards (e.g., `translateY(10px)` to `0`).
- **Purpose:** This mimics the physical action of bringing an object closer to the viewer.
- **Duration:** ~200ms - 250ms for entrances. Exits should be slightly faster (~150ms) as the user no longer needs to focus on the departing element.

### Contextual Panels (Sidebars, Bottom Sheets)
- **Behavior:** Side panels slide in from the corresponding edge of the screen (Right panel slides left).
- **Purpose:** Orients the user spatially. They understand the panel exists "off-screen" to the right.
- **Easing:** An "ease-out" curve. The panel enters quickly but slows down smoothly as it reaches its resting position.

### Expand/Collapse (Accordions)
- **Behavior:** Smoothly animating the `height` (or `grid-template-rows`) of an element.
- **Purpose:** Prevents sudden vertical jumping of the page content, which disorients the reader's eye.

### Interactive Feedback (Micro-interactions)
- **Behavior:** Buttons, cards, and interactive icons subtly scale down (e.g., `scale(0.97)`) on click/tap, and return to normal on release.
- **Purpose:** Provides immediate, tactile feedback that the interface has registered the user's intent.

## 3. The "Zen Mode" Transition
When a user scrolls deeply into the Reader:
- **Behavior:** The top navigation bar and bottom tab bar translate out of the viewport. The text margins may gently expand.
- **Purpose:** Creates a distraction-free reading zone smoothly without a jarring page reload.

## 4. Accessibility and Reduced Motion
ADQ respects user preferences for accessibility.
- **Behavior:** The system must actively listen for the `prefers-reduced-motion` media query.
- **Enforcement:** If a user has requested reduced motion in their OS settings, all sliding and scaling animations must instantly degrade to simple, instant cross-fades or absolute zero-duration state changes. No exceptions.
