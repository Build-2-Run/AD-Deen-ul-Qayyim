# Feedback System (UX)

Feedback informs the user about the results of their actions. It must be immediate, clear, and proportionate to the action taken.

## Types of Feedback

1. **Inline Validation**
   - Used in forms (e.g., Zakat calculator inputs).
   - Validation occurs on `blur` or submit. Errors are displayed immediately below the input in a semantic error color (`var(--error)`), accompanied by a clear, non-technical explanation.

2. **Toast Notifications**
   - Used for asynchronous or ephemeral actions (e.g., "Saved to Bookmarks", "Settings updated").
   - **Position**: Bottom-center or bottom-right.
   - **Duration**: Auto-dismiss after 3-5 seconds.
   - **Rule**: Do not use toasts for critical errors that require user intervention.

3. **Inline States (Loading / Error)**
   - When fetching data for a specific section (e.g., a `KnowledgePanel` loading Tafsir), replace the content area with a subtle skeleton loader or spinner. Do not block the entire screen.
   - If a fetch fails, display an inline error state with a "Retry" button rather than breaking the entire page.

4. **Global Loading**
   - Only used for initial app loads or major route transitions.
   - Use a minimal, branded loading indicator.

5. **Tone of Voice**
   - Error messages must be polite and objective. Avoid blaming the user (e.g., instead of "You entered an invalid date," use "Please enter a valid date format").
