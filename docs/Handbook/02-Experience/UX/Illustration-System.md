# Illustration System (UX)

Illustrations and graphics in ADQ (`KnowledgeMedia`) are strictly educational and functional. Decorative imagery that does not impart knowledge or clarify a concept is avoided.

## Usage Guidelines

1. **Purpose-Driven**
   - Use graphics to explain complex concepts (e.g., Fiqh of inheritance flowcharts, astronomy diagrams for prayer times, maps of historical battles).
   - Do not use stock photography or abstract art merely to fill space.

2. **Integration**
   - Media should be embedded within the `ReaderBlock` using the `KnowledgeMedia` component.
   - It must respect the maximum width of the content container so as not to disrupt the reading flow.

3. **Presentation**
   - **Borders & Backgrounds**: Graphics should sit within a muted, elevated surface (`var(--surface-elevated)`) with a subtle border to separate them from text.
   - **Captions**: Every illustration must be accompanied by a descriptive caption.
   - **Responsiveness**: Images must scale gracefully. On mobile, complex diagrams may require tap-to-expand functionality (a fullscreen lightbox).

4. **Tone**
   - Graphics should be minimalist, utilizing the platform's color tokens rather than clashing external color palettes.
   - Avoid overly intricate or noisy diagrams that require excessive zooming to decipher.
