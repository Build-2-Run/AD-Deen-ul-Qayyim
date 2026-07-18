
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
      version: "1.0.0"
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
            arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
            translations: {
              en: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended."
            },
            topics: ["Intentions", "Sincerity"],
            relations: ["quran-98-5"]
          },
          {
            number: "2",
            grade: "Sahih",
            arabic: "أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الْجَرَسِ",
            translations: {
              en: "Sometimes it is (revealed) like the ringing of a bell."
            },
            topics: ["Revelation"],
            relations: ["quran-42-51"]
          }
        ]
      }
    ]
  };
}
module.exports = { importData };
