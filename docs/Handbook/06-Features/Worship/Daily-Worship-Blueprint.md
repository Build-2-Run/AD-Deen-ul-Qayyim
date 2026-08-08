# Daily Worship Blueprint

## Purpose
To serve as a daily companion for Adhkar (remembrances), Duas (supplications), and daily Quranic recitation targets.

## Primary User Intentions
- Read Morning and Evening Adhkar.
- Find specific situational Duas (e.g., before eating, traveling).
- Track daily reading habits.

## First-Screen Experience
- **Time-Contextual**: If it is morning, the Morning Adhkar are immediately prominent. If evening, Evening Adhkar.
- **Progress Ring**: A calm, subtle visual indicator of the day's completed remembrances.

## Navigation Hierarchy
- **Level 1**: Daily Home (Contextual Adhkar & Progress)
- **Level 2**: Dua Categories (Travel, Protection, Illness)
- **Level 3**: The Dua Node

## Reading / Task Flow
1. User opens the Morning Adhkar collection.
2. A specialized `KnowledgeCollection` (Swiper/Carousel) allows the user to swipe left-to-right through the Adhkar.
3. A counter on each card ticks down as the user taps (e.g., "Repeat 3 times").

## Universal Knowledge Component Usage
- **KnowledgeCard**: Customized with a large tap target for the repetition counter.
- **ActionBar**: Allows users to save specific Duas to their Personal Library.

## Reader Integration
Not used for the actual Adhkar (which are short). Used only if the user clicks "Explore" to read the Fiqh or Hadith origin of a specific Dua.

## Search Integration
Users can search by emotion or situation ("anxious", "travel").

## Library Integration
Users can build a "Custom Wird" (daily routine) by saving various Duas into a specialized Collection.

## Accessibility Considerations
- The repetition tap target must be massive (accessible while walking or commuting).
- Contrast must be high for outdoor reading.

## Desktop vs Mobile Behavior
- **Desktop**: Grid layout for browsing Duas.
- **Mobile**: Highly optimized swiping carousel for one-handed operation during Adhkar.

## Progressive Disclosure Strategy
- Transliteration is hidden by default to encourage Arabic reading, but can be toggled globally.

## Future Roadmap (v2/v3)
- **v2**: Audio playback for correct pronunciation of Duas.
- **v3**: Apple Watch / WearOS integration for tapping through Adhkar.
