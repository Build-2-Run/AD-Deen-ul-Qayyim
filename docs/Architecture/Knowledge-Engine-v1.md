# AD-Deen-ul-Qayyim

# Knowledge Engine Architecture v1.0

## Mission
The ADQ Knowledge Engine is the conceptual and structural backbone of the entire platform. Its mission is to break down vast, historically fragmented Islamic and scientific knowledge into distinct, interrelated units. By doing so, it reveals the profound interconnectedness of the Quran, Sunnah, science, history, and daily practice, transforming a traditional reading experience into an immersive, exploratory knowledge network.

---

## 1. The Knowledge Node (Core Unit)
A **Knowledge Node** is the smallest, indivisible, and reusable unit of knowledge within ADQ. Everything—from an Ayah to a mathematical formula—is treated as a node. 

### Examples of Knowledge Nodes:
- Ayah (e.g., Al-Baqarah 2:255)
- Hadith (e.g., Sahih Bukhari 1)
- Prophet (e.g., Ibrahim)
- Scientific Concept (e.g., Earth's Rotation)
- Fiqh Ruling (e.g., Conditions of Wudu)
- Place (e.g., Mount Uhud)

### Node Data Model
Every node follows a strict schema to ensure indexability and relational mapping:
- **ID:** Unique universal identifier (e.g., `node_ayah_2_255`)
- **Title:** Primary human-readable name
- **Category:** The overarching domain (e.g., `Quran`, `Science`, `Fiqh`)
- **Description:** A concise summary of the node's content
- **Tags:** Descriptive labels for filtering (e.g., `prayer`, `purification`, `water`)
- **Keywords:** Indexed terms for search engines
- **Sources:** The primary origin text or data (e.g., `Sahih Muslim`)
- **References:** Secondary literature or scholarly consensus
- **Related Nodes:** Array of direct ID links to other nodes
- **Difficulty:** Categorization for learning paths (e.g., `Beginner`, `Intermediate`, `Advanced`)
- **Learning Stage:** Position in a curriculum (e.g., `Foundation`, `Exploration`)
- **Last Updated:** Timestamp for version control

---

## 2. Knowledge Connections
A **Knowledge Connection** defines *how* and *why* two Knowledge Nodes interact. Instead of simple hyperlinks, connections are semantic; they carry meaning.

### Connection Types
Connections are directional edges in our knowledge graph:
- **Supports:** (e.g., Hadith *Supports* Fiqh Ruling)
- **Explains:** (e.g., Tafsir *Explains* Ayah)
- **Causes:** (e.g., Sun Position *Causes* Prayer Time)
- **Mentions:** (e.g., Ayah *Mentions* Prophet Musa)
- **Located In:** (e.g., Battle of Badr *Located In* Badr)
- **Expands:** (e.g., Science *Expands* Quranic observation)
- **Timeline:** (e.g., Event A *Before* Event B)

### Example Connection Chain
```text
[Node: Asr Prayer] 
       ↓ (Requires)
[Node: Sun Position (Shadow equals height)]
       ↓ (Causes)
[Node: Earth's Rotation]
       ↓ (Belongs to Domain)
[Node: Astronomy]
       ↓ (Expands upon)
[Node: Ayah (Surah Al-Asr)]
```

---

## 3. Relationship Model
ADQ is built on a Graph Database architecture. Domains that traditionally exist in silos are cross-pollinated through semantic connections.

### Entity Relationship Diagram (ASCII)
```text
                          +-----------+
                          |   Place   |
                          +-----------+
                                ^
                                | (Located In)
+---------+ (Mentions)    +-----------+    (Participated) +--------+
|  Quran  | ------------> |   Event   | <---------------- | Person |
+---------+               +-----------+                   +--------+
     |                          |                              |
     | (Explains)               | (Timeline)                   | (Narrates)
     v                          v                              v
+---------+ (Supports)    +-----------+                   +--------+
| Science | <------------ |   Fiqh    | <---------------- | Hadith |
+---------+               +-----------+    (Derives from) +--------+
     ^                          |
     | (Calculates)             | (Requires)
     v                          v
+---------+               +-----------+
| Nature  | ------------> | Calculator|
+---------+ (Influences)  +-----------+
```
*In this model, a user reading about the Battle of Badr (Event) can instantly see the Angels sent down (Quran), the companions involved (Person), the geography of the wells (Place), and the rulings on spoils of war (Fiqh).*

---

## 4. Search Architecture
The future ADQ search is not a simple string matcher; it is a **Federated Graph Search**.

### How it works:
When a user searches for **"Sun"**, the engine queries all nodes and traverses connections up to 1 level deep.

### Search Result Composition:
- **Ayat:** "By the sun and its brightness..." (Ash-Shams 91:1)
- **Hadith:** Narrations regarding eclipses not being caused by death.
- **Prayer:** How the sun's zenith dictates Dhuhr.
- **Astronomy / Science:** Heliocentrism and orbit data.
- **Nature:** The role of sunlight in agriculture (mentioned in Quran).
- **Calculators:** Prayer Time calculation algorithms relying on solar declination.
- **History:** Events taking place at dawn or dusk.

---

## 5. Recommendation Architecture
ADQ's recommendation engine shifts from "What is popular" to "What is conceptually adjacent." It builds personalized learning paths contextually.

### Logic Flow:
**Trigger:** User completes studying the node: `Wudu (Ablution)`.
**Engine Action:** Traverses outward from the `Wudu` node based on the user's difficulty level.

**Recommendations Generated:**
- *(Related To)* -> **Prayer (Salah):** The natural next step.
- *(Alternative)* -> **Tayammum:** Dry purification.
- *(Requires)* -> **Water (Nature):** The Fiqh of pure water.
- *(Expands)* -> **Hygiene (Health & Science):** The biological benefits of washing extremities.
- *(Supports)* -> **Hadith:** "Cleanliness is half of faith."

---

## 6. Future AI Assistant Integration
The future ADQ AI Assistant operates strictly as a **Graph-Constrained RAG (Retrieval-Augmented Generation) Agent**.

### AI Interaction Rules:
1. **Verified Knowledge Only:** The AI cannot generate facts from its latent space. It can only query the ADQ Knowledge Engine.
2. **Citation-Forced:** Every claim the AI makes must link back to a specific Knowledge Node UUID.
3. **No Hallucinated Links:** If the Knowledge Engine does not explicitly define a semantic connection (e.g., `[Quran] -> (Supports) -> [Science]`), the AI is forbidden from claiming it exists.
4. **Role:** The AI acts as a tutor, summarizing nodes, traversing connections for the user, and answering questions by compiling Node descriptions contextually.

---

## 7. Roadmap & Future Expansion

- **Phase A:** Core Data Modeling (Schema definition in TypeScript, potentially Prisma/PostgreSQL or Neo4j).
- **Phase B:** Node Ingestion (Importing Quran, Hadith, and 99 Names datasets as structured nodes).
- **Phase C:** Connection Mapping (Manual curation and algorithmic linking of primary sources).
- **Phase D:** Graph Search Implementation (Deploying a graph database or highly relational SQL view for the frontend).
- **Phase E:** AI Knowledge Integration (Connecting the RAG pipeline to the finalized graph for secure querying).

---

End of Document
