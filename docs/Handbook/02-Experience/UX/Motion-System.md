# Motion System (UX)

Motion in ADQ is not decorative; it is functional. It explains changes in state, establishes spatial relationships, and provides feedback, all while maintaining the core principle of **Calm Focus**.

## Classifications of Motion

1. **Essential (State Changes)**
   - **Dialogs & Overlays**: Fade in and scale up slightly (`zoom-in-95`). Explains that a new layer has been stacked above the content.
   - **Sheets (`KnowledgePanel`)**: Slide in from the edge of the screen (Right on Desktop, Bottom on Mobile). This establishes the panel's spatial origin outside the viewport.

2. **Helpful (Feedback)**
   - **Hover States**: Buttons and interactive surfaces transition smoothly (e.g., `duration-300` or `duration-150`). Sudden, harsh color snapping is avoided.
   - **Expand/Collapse**: Accordions and hidden sections must slide open smoothly so the user's eye can track the shifting content.

3. **Decorative (Avoid)**
   - Bouncing, shaking, or continuous looping animations are strictly forbidden unless used for a very specific, temporary instructional purpose (e.g., a subtle pulse on a new feature).

## Timing and Easing

- **Speed**: Transitions should be snappy but perceptible. 
  - Micro-interactions (hover, active): `100ms - 150ms`.
  - Macro-interactions (Dialogs, Sheets, Page transitions): `200ms - 300ms`.
- **Easing**: Use natural easing curves (`ease-out` for entering elements, `ease-in` for exiting elements) so animations feel organic and unforced.
