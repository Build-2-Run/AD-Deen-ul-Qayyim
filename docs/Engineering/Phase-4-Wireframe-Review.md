# AD-Deen-ul-Qayyim

# Phase 4: Knowledge Gateway Wireframe Review

## 1. Why Each Section Exists

1. **Welcome Section:** Establishes an inspirational tone. The Bismillah and Hadith center the user's intention on seeking knowledge.
2. **Today's Learning Focus:** Highlights a daily featured Ayah (or Hadith). It reduces choice paralysis by providing one primary action ("Continue Learning").
3. **Resume (Continue Learning):** Helps returning users pick up exactly where they left off, keeping momentum alive (e.g., Inheritance Calculator progress).
4. **Time & Prayer:** Connects the digital experience to the user's physical spiritual rhythm, which is core to Islamic practice.
5. **Explore Knowledge:** The primary navigation hub offering entry points into all available knowledge domains.
6. **Favorites:** Provides quick access to deeply personal saved content (bookmarks, notes, reflections).
7. **Recent Activity:** A timeline offering a sense of accomplishment and a quick way to backtrack to recent studies.

---

## 2. User Flow

1. **Arrival:** The user is greeted warmly and reminded of their spiritual purpose.
2. **Immediate Action:** The user sees a featured daily snippet. They can click "Continue Learning" to dive straight in, or resume their previous unfinished module.
3. **Exploration:** If they wish to start something new, the `Explore Knowledge` grid is immediately available directly below.
4. **Utility & Personalization:** Lower sections (Favorites, Recent Activity) serve as a personal dashboard for returning users looking for specific past data.

---

## 3. Components Reused

This wireframe heavily proved the modularity of the Phase 2 & 3 UI foundation by extensively reusing:
- `Typography`: Used for hierarchical text, arabic rendering, and small captions.
- `Button`: Used for the primary call-to-action.
- `KnowledgeSurface`: Reused across the Featured Ayah, Resume card, Prayer times, and the 14 Explore categories.
- `Grid`: Used to structure the multi-column sections (Resume/Prayer, Explore, Favorites/Activity).
- `Stack`: Used for vertical layout management.

---

## 4. Components That Still Need To Be Built

While the wireframe relies on foundational layout logic, building out the real features will require these specific Domain Components:
- `ProgressBar` / `ProgressRing` (Currently using a raw div placeholder).
- `Timeline` (Currently using raw divs in Recent Activity).
- `DomainIcon` (SVG iconography for the Explore Knowledge cards).
- `PrayerClock` / `PrayerCountdown` component for active time management.

---

## 5. Future Improvements

- **Animations:** Implement subtle entrance animations and smooth scrolling once the content structures are finalized.
- **Data Hooking:** Replace static strings with stateful API responses or local storage (e.g., actual prayer calculation logic).
- **Personalization:** Dynamically change the "Welcome" message based on the time of day (e.g., "Good morning" vs "Good evening").
