# Quran Module

This directory encapsulates the entire Quran experience. Following the architectural principle of module independence, this feature completely owns its UI, state hooks, and domain logic while relying on the global App Shell for layout.

## Structure

- `components/`: Pure presentation components specifically designed for Quranic text rendering (handling Arabic typography, Ayah numbering, Surah listing).
- `pages/`: Routable container components (`QuranHome`, `SurahPage`).
- `hooks/`: Custom React hooks for bridging the UI with the data services.
- `services/`: Domain-specific API fetching and logic that interacts with the global Knowledge Engine.
- `types/`: Feature-specific interfaces that extend or adapt the core data schemas for UI consumption.
