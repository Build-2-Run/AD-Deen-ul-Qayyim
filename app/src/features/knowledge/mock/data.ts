import { KnowledgeNode } from '../types';

export const mockNodes: KnowledgeNode[] = [
  {
    id: "quran-2-255",
    type: "quran",
    title: "Ayatul Kursi",
    subtitle: "Al-Baqarah (2:255)",
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...",
    primaryTranslation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of [all] existence...",
    metadata: {
      authorityClass: "primary_revelation",
      language: ["ar", "en"],
      category: "Theology"
    },
    breadcrumbs: [
      { id: "quran", label: "Quran" },
      { id: "surah-2", label: "Al-Baqarah" }
    ],
    relatedNodes: [
      { id: "tafsir-2-255", title: "Tafsir Ibn Kathir on 2:255", type: "concept", relation: "tafsir" }
    ]
  },
  {
    id: "hadith-bukhari-1",
    type: "hadith",
    title: "Actions are by Intentions",
    subtitle: "Sahih al-Bukhari 1",
    arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    primaryTranslation: "Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, \"The reward of deeds depends upon the intentions...\"",
    metadata: {
      authorityClass: "primary_sunnah",
      collection: "Sahih al-Bukhari",
      confidence: "high",
      language: ["ar", "en"]
    },
    breadcrumbs: [
      { id: "hadith", label: "Hadith" },
      { id: "bukhari", label: "Sahih al-Bukhari" },
      { id: "bukhari-revelation", label: "Book of Revelation" }
    ]
  },
  {
    id: "fiqh-wudu-obligations",
    type: "fiqh",
    title: "Obligations of Wudu",
    body: "The obligatory acts of ablution (Wudu) are four, derived from Surah Al-Ma'idah (5:6): washing the face, arms, wiping the head, and washing the feet.",
    metadata: {
      authorityClass: "scholarly_consensus",
      readingLevel: "beginner",
      language: ["en"],
      category: "Purification"
    },
    breadcrumbs: [
      { id: "fiqh", label: "Fiqh" },
      { id: "purification", label: "Taharah (Purification)" }
    ],
    citations: [
      {
        id: "cite-quran-5-6",
        source: "Quran",
        reference: "5:6",
        authority: "primary_revelation",
        preview: "O you who have believed, when you rise to [perform] prayer, wash your faces..."
      }
    ]
  },
  {
    id: "history-badr",
    type: "history",
    title: "Battle of Badr",
    subtitle: "17 Ramadan, 2 AH",
    body: "The Battle of Badr was a key battle in the early days of Islam and a turning point in Muhammad's (ﷺ) struggle with his opponents among the Quraish in Mecca.",
    metadata: {
      authorityClass: "historical_record",
      source: "Sirat Ibn Hisham",
      language: ["en"]
    },
    breadcrumbs: [
      { id: "history", label: "Islamic History" },
      { id: "prophetic-era", label: "Prophetic Era (Seerah)" }
    ]
  },
  {
    id: "science-embryology",
    type: "science",
    title: "Stages of Human Development",
    subtitle: "Scientific observation of Quranic verses",
    body: "The Quran describes human development in stages: Nutfah (drop), Alaqah (clinging clot), Mudghah (chewed lump), and bones clothed with flesh. These descriptions align remarkably with modern embryology.",
    metadata: {
      authorityClass: "scientific_observation",
      readingLevel: "intermediate",
      language: ["en"]
    },
    breadcrumbs: [
      { id: "science", label: "Science & Quran" },
      { id: "biology", label: "Biology" }
    ]
  },
  {
    id: "platform-zakat-calc",
    type: "platform",
    title: "Zakat on Gold",
    subtitle: "Platform Calculation Rule",
    body: "Zakat is obligatory on gold if it reaches the Nisab (85 grams) and one lunar year has passed. The rate is 2.5%.",
    metadata: {
      authorityClass: "educational",
      language: ["en"]
    },
    breadcrumbs: [
      { id: "tools", label: "Tools" },
      { id: "zakat", label: "Zakat Calculator" }
    ]
  }
];
