# Astronomy & Time Blueprint

## Purpose
To provide highly accurate, location-based astronomical data necessary for Islamic rituals (Salah times, Qibla direction, Moon sighting).

## Primary User Intentions
- Check current and upcoming prayer times.
- Find the exact Qibla direction.
- Check the current Hijri date and moon phase.

## First-Screen Experience
- **Dashboard**: A calm, minimalist dashboard showing the next prayer time prominently, with a subtle countdown.
- **Visual Environment**: The background gently reflects the current time of day (e.g., dark for Isha, soft light for Fajr), adhering to the motion and color system.

## Navigation Hierarchy
- **Level 1**: Time Dashboard
- **Level 2**: Monthly Calendar / Qibla Compass / Calculation Settings

## Reading / Task Flow
1. This is a utility module; the user usually enters, checks the time/direction, and exits within 10 seconds.
2. For deep dives, users can open the monthly calendar or adjust calculation methodologies.

## Universal Knowledge Component Usage
- **KnowledgeCard**: Used to explain *why* a prayer time is calculated a certain way (e.g., explaining the 18-degree dawn rule).

## Reader Integration
Minimal. Only used when reading the Fiqh rules behind prayer times (accessed via the `ActionBar` Explore button).

## Search Integration
Users can search for specific cities to check their prayer times globally.

## Library Integration
Users can save specific locations to their library for quick switching.

## Accessibility Considerations
- The countdown timer and next prayer must be massive and readable from a distance.
- Compass UI must provide haptic feedback (vibration) when aligned with the Qibla for visually impaired users.

## Desktop vs Mobile Behavior
- **Desktop**: A persistent widget in the Application Shell sidebar.
- **Mobile**: A dedicated tab or a prominent widget on the Home screen. Compass utilizes device sensors.

## Progressive Disclosure Strategy
- Complex calculation settings (e.g., MWL vs ISNA vs Umm al-Qura) are hidden deep in a Settings drawer, out of the way of daily users.

## Future Roadmap (v2/v3)
- **v2**: Augmented Reality (AR) Qibla finder.
- **v3**: Live global moon-sighting reports and user-submitted data.
