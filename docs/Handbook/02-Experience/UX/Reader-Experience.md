# Reader Experience (UX)

The Reader is the most critical component of the ADQ platform. It is a universal container designed to ingest and present any Knowledge Node (Quran, Hadith, Fiqh, History, Science) without requiring custom layouts.

## Interaction Philosophy

1. **Immersive Reading**
   - The primary action is scrolling and reading.
   - Max-width constraints (`max-w-3xl`) ensure optimal line lengths for eye tracking.
   - Staggered alignment is preferred for bilingual nodes: Arabic (RTL) aligned right, Translation (LTR) aligned left.

2. **Reading Focus Mode**
   - **Trigger**: Activated manually via a top-bar toggle, or automatically upon scrolling down (configurable).
   - **Behavior**: Hides the Application Shell (Sidebar/TopNav) and Reader Header/Footer. The screen becomes a pure canvas for text.
   - **Exit**: Scrolling up past a certain threshold or toggling the floating button restores the chrome.

3. **Contextual Deep Dives (`KnowledgePanel`)**
   - Users frequently need to check Tafsir, lexicons, or cross-references.
   - **Rule**: Never navigate the user away from their reading position to view context.
   - **Execution**: Inline `Citation` buttons trigger a `KnowledgePanel`. 
   - **Desktop**: Slides in from the right (`Sheet`), squishing or resting beside the main content.
   - **Mobile**: Pulls up from the bottom (`BottomSheet`), easily dismissible with a downward swipe.

4. **Progress Tracking**
   - An ultra-thin, non-distracting progress bar fixed to the top edge of the screen provides subconscious feedback on scroll depth.
   - Prevents the "infinite scroll fatigue" by giving a clear sense of document length.
