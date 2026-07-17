# AD-Deen-ul-Qayyim

# System Architecture v1.0

## Objective
The master architecture document for the entire AD-Deen-ul-Qayyim platform. This is the blueprint that connects every specification, UI system, and data architecture created so far into a unified, scalable system.

---

## 1. Vision
AD-Deen-ul-Qayyim is a **personal Islamic learning platform** and a highly connected **knowledge engine**. It serves as a **lifelong learning companion** built upon rigorous, **evidence-first** and **citation-first** principles. The interface and user experience are **calm by design**, prioritizing reflection over distraction. Architecturally, it is **expandable for future generations**, ensuring that as knowledge is mapped, the platform can evolve endlessly without losing its foundational integrity.

---

## 2. Five Layer Architecture

ADQ is composed of a five-layer stack separating infrastructure, data, knowledge logic, user experience, and the user interface.

### Architecture Diagram (ASCII)
```text
+----------------------------------------------------+
| 5. Presentation Layer                              |
| (React, Vite, TypeScript, Tailwind UI Components,  |
|  Responsive Pages)                                 |
+----------------------------------------------------+
                          ↓
+----------------------------------------------------+
| 4. Experience Layer                                |
| (Knowledge Gateway, Learning Journeys, Search,     |
|  Recommendations, Bookmarks, Theme System)         |
+----------------------------------------------------+
                          ↓
+----------------------------------------------------+
| 3. Knowledge Layer                                 |
| (Knowledge Engine, Nodes, Connections,             |
|  Collections, Search Index, Recommendations)       |
+----------------------------------------------------+
                          ↓
+----------------------------------------------------+
| 2. Data Layer                                      |
| (JSON Schemas, Validation, Version History,        |
|  Translations, Media, Taxonomy, Relationships)     |
+----------------------------------------------------+
                          ↓
+----------------------------------------------------+
| 1. Infrastructure Layer                            |
| (GitHub, CI/CD, Deployment, Testing, Docs)         |
+----------------------------------------------------+
```

---

## 3. System Flow

Information flows linearly from user intent, through the Knowledge Engine, retrieving structured data, rendering the UI, and finally suggesting the next step in the learning journey.

**Flow Example:**
```text
User 
  ↓
Knowledge Gateway 
  ↓
Knowledge Engine 
  ↓
Knowledge Node 
  ↓
References
  ↓
Render UI 
  ↓
Related Knowledge 
  ↓
Continue Learning
```

---

## 4. Major Systems

The ADQ ecosystem is composed of several major, domain-specific systems:
- **Gateway:** The landing experience and personalized dashboard.
- **Quran:** Text, audio, translation, and Tafsir integration.
- **Hadith:** Authentic narrations mapped by topic and chain.
- **Prayer:** Geolocation-based time calculation and Qibla.
- **History:** Timelines of Prophets, Companions, and Islamic events.
- **Nature:** Observations of the natural world linked to theology.
- **Science:** Bridging physical laws and Quranic concepts.
- **Astronomy:** Lunar calendars, eclipses, and orbital mechanics.
- **Calculators:** Algorithmic tools for Zakat and Mirath (inheritance).
- **Knowledge Graph:** The semantic network connecting all domains.
- **Search:** Federated engine querying the entire graph.
- **Learning Paths:** Guided, step-by-step curricula.
- **AI Assistant:** RAG-constrained interactive tutor.
- **Settings:** Customizations (Themes, Reading Modes).
- **User Profile:** Syncing streaks, history, and goals.
- **Bookmarks:** Personal saved references.
- **Notes:** Personal knowledge retention and reflections.

---

## 5. Module Independence

Every domain module in ADQ must be strictly independent. A module (e.g., `Calculators` or `Quran`) entirely owns its:
- **UI**
- **Data**
- **Search**
- **Documentation**
- **Tests**

Yet, every independent module seamlessly integrates with the shared **Knowledge Engine**, allowing cross-module connections without tightly coupling their codebases.

---

## 6. Design Principles

- **Calm**
- **Readable**
- **Minimal**
- **Evidence-first**
- **Transparent**
- **Fast**
- **Offline-friendly (future)**
- **Accessible**
- **Scalable**
- **Maintainable**

---

## 7. AI Principles

- AI never invents knowledge.
- AI never creates unsupported relationships.
- Every answer must trace back to Knowledge Nodes.
- Every answer should provide citations where available.
- AI assists learning.
- AI never replaces authentic sources.

---

## 8. Future Expansion

The architecture is inherently decoupled to prepare for:
- Mobile Apps
- Desktop App
- Offline Mode
- Graph Database
- Community Contributions
- Multi-language Expansion
- API
- Plugin System
- Voice Assistant
- Interactive Maps
- 3D Models
- AR/VR (future)

---

## 9. Development Philosophy

- Build slowly.
- Build correctly.
- Never sacrifice authenticity.
- Never sacrifice clarity.
- Every feature must improve learning.
- Quality before quantity.
- Documentation before implementation.
- Refactor instead of patching.

---

## 10. Version 1 Scope

Explicitly, Version 1 of AD-Deen-ul-Qayyim focuses on the core utility and foundational knowledge. 

**Included:**
- Quran
- Hadith
- Prayer
- 99 Names
- Duas
- History
- Knowledge Connections
- Calculators
- Search
- Learning Paths
- Theme System
- Bookmarks
- Documentation

**Excluded:**
- Do NOT include advanced AI generation.
- Do NOT include community editing.
- Do NOT include speculative features.

---

## 11. Success Criteria

Success for AD-Deen-ul-Qayyim is defined differently than typical software.

**Success is NOT:**
- Number of users
- Downloads
- Revenue

**Success IS:**
- Authentic knowledge.
- Clear understanding.
- Daily usefulness.
- Trust.
- Maintainability.
- Long-term sustainability.

---

## 12. Roadmap

```text
Foundation
   ↓
Architecture
   ↓
Data
   ↓
React Foundation
   ↓
Application Shell
   ↓
Knowledge Gateway
   ↓
Quran Module
   ↓
Hadith Module
   ↓
Prayer System
   ↓
Knowledge Connections
   ↓
Calculators
   ↓
Search
   ↓
AI Assistant
   ↓
Version 1.0
```

---
End of Document
