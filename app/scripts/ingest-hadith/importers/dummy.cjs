
async function importData() {
  return {
    metadata: {
      id: "bukhari",
      name: "Sahih al-Bukhari",
      arabicName: "صحيح البخاري",
      author: "Imam Muhammad al-Bukhari",
      totalHadith: 7563,
      description: "The most authentic book of Hadith in Sunni Islam.",
      source: "sunnah.com (Sample)",
      version: "1.0.0",
      compilerVersion: "3.1.0",
      schemaVersion: "2.0",
      language: "ar",
      checksum: "dummy-hash-123"
    },
    books: [
      {
        id: "book-1",
        number: 1,
        name: "Revelation",
        arabicName: "كتاب بدء الوحى",
        hadiths: [
          {
            number: "1",
            grade: "Sahih",
            chapter: {
              number: "1",
              arabic: "بَابُ كَيْفَ كَانَ بَدْءُ الْوَحْيِ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم",
              english: "How the Divine Revelation started to be revealed to Allah's Messenger"
            },
            narrator: "‘Umar bin Al-Khattab",
            arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
            translations: {
              en: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."
            },
            topics: ["Intentions", "Sincerity"],
            relations: ["quran:surah:98:ayah:5"],
            references: {
              book: 1,
              hadith: 1
            }
          },
          {
            number: "2",
            grade: "Sahih",
            chapter: {
              number: "1",
              arabic: "بَابُ كَيْفَ كَانَ بَدْءُ الْوَحْيِ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم",
              english: "How the Divine Revelation started to be revealed to Allah's Messenger"
            },
            narrator: "‘Aisha",
            arabic: "أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الْجَرَسِ",
            translations: {
              en: "Sometimes it is (revealed) like the ringing of a bell."
            },
            topics: ["Revelation"],
            relations: ["quran:surah:42:ayah:51"],
            references: {
              book: 1,
              hadith: 2
            }
          }
        ]
      }
    ]
  };
}
module.exports = { importData };
