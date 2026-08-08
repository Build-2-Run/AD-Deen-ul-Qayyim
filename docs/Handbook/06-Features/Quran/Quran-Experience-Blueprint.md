# Quran Experience Blueprint

## Purpose
To provide the definitive, most immersive, and easily navigable interface for reading, reciting, and understanding the Holy Quran.

## Primary User Intentions
- Read a specific Surah or Juz.
- Resume reading from the last position.
- Understand the meaning via translations and Tafsir.
- Memorize or study specific Ayahs.

## First-Screen Experience
- **Hero Section**: "Continue Reading" block with the last visited Ayah and a subtle progress indicator.
- **Quick Access**: Grid of recently accessed Surahs or Bookmarks.
- **Browse**: Tabbed navigation (Surah | Juz | Page) using the `KnowledgeCollectionView`.

## Navigation Hierarchy
- **Level 1**: Quran Home (Browse by Surah/Juz)
- **Level 2**: Surah Index (List of Ayahs)
- **Level 3**: The Universal Reader (Continuous reading mode)

## Reading / Task Flow
1. User selects a Surah from the Home screen.
2. The Universal Reader launches, enforcing "Reading Focus" for deep immersion.
3. User scrolls seamlessly. Inline `Citation` buttons prompt exploration of Tafsir.

## Universal Knowledge Component Usage
- **KnowledgeCard**: Used in list views for Surah summaries.
- **MetadataDisplay**: Indicates revelation period (Meccan/Medinan).

## Reader Integration
Fully utilizes the Universal Reader. Arabic text is heavily stylized using large typography; English translations align strictly below or beside it (staggered).

## Search Integration
Quranic text and translations are indexed globally. Selecting a search result deep-links into the Universal Reader at the exact Ayah.

## Library Integration
Ayahs can be Bookmarked or added to custom Collections (e.g., "Duas from Quran"). Notes can be attached to specific Ayahs.

## Accessibility Considerations
- Highly tunable line height and font sizing for Arabic script to prevent tashkeel (vowel marks) overlap.
- Screen-reader focus on the primary Arabic text first, followed by translation.

## Desktop vs Mobile Behavior
- **Desktop**: Dual-pane possible (Arabic on right, translation on left). `KnowledgePanel` (Tafsir) slides in from the right.
- **Mobile**: Stacked layout (Arabic on top). `KnowledgePanel` pulls up from the bottom as a sheet.

## Progressive Disclosure Strategy
- Tafsir, lexical breakdowns, and audio controls are hidden by default and summoned only when a user interacts with an Ayah's `ActionBar`.

## Future Roadmap (v2/v3)
- **v2**: Advanced audio playback with word-by-word highlighting.
- **v3**: Memorization tracker and AI-assisted Tajweed checking.
