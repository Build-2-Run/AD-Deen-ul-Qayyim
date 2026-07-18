# Phase 11.2: Reader Integration

## Overview
This phase marks the successful completion of the generic **Platform Reader Engine**. 
The legacy `ReadingWorkspace` (which tightly coupled generic reader UI elements with the `features/quran` module) has been entirely deprecated and removed.

The new architecture guarantees that the Reader remains purely presentational and completely content-agnostic. Any feature module (Quran, Hadith, History) can compose a reader experience natively without rewriting the UI logic.

## Architecture

The `src/platform/reader/` layer exposes the generic `<ReaderLayout>` component.

```tsx
<ReaderLayout 
  header={<ReaderHeader />}
  toolbar={<ReaderToolbar items={toolbarItems} />}
  leftSidebar={<ReaderSidebar slot="left">{content}</ReaderSidebar>}
>
  <ReaderContent>
    {children}
  </ReaderContent>
</ReaderLayout>
```

### Module Responsibilities
Feature modules such as `features/quran` are now only responsible for providing:
1. **Content**: e.g., `<AyahViewer />`.
2. **Toolbar Configurations**: An array of `ReaderToolbarItem` objects specifying the enabled buttons.
3. **Sidebar Slot Injections**: Injecting Surah information into the `leftSidebar` slot, or connections into the `rightSidebar` slot.
4. **Data Acquisition**: Fetching nodes securely via the `DatasetRegistry`.

## Dependency Rules Enforced
1. **No Feature-to-Feature Imports**: A feature module cannot import another feature module.
2. **Platform Layer Reusability**: Any code that can be used by at least two feature modules is moved to `src/platform/`.
3. **Dataset Agnosticism**: No UI component imports JSON directly.

## Outcomes
- A globally manageable `ReaderPreferences` settings state.
- Scalability to easily adopt the Hadith and History modules.
- Absolute separation of concerns between Platform and Features.
