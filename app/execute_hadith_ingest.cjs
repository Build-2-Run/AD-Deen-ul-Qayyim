const fs = require('fs');
const path = require('path');

const INGEST_DIR = path.join(__dirname, 'scripts', 'ingest-hadith');
const IMPORTERS_DIR = path.join(INGEST_DIR, 'importers');
if (!fs.existsSync(IMPORTERS_DIR)) fs.mkdirSync(IMPORTERS_DIR, { recursive: true });

// 1. importer.cjs
const importerCode = `
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
            relations: ["quran-98-5"],
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
            relations: ["quran-42-51"],
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
`;
fs.writeFileSync(path.join(IMPORTERS_DIR, 'dummy.cjs'), importerCode);

// 2. normalizer.cjs
const normalizerCode = `
function normalize(rawData) {
  const normalizedBooks = rawData.books.map(book => ({
    ...book,
    hadiths: book.hadiths.map(h => ({
      id: \`hadith:\${rawData.metadata.id}:\${book.number}:\${h.number}\`,
      collection: rawData.metadata.id,
      book: book.number,
      chapter: h.chapter || null,
      number: h.number,
      grade: h.grade,
      narrator: h.narrator || null,
      arabic: h.arabic,
      translations: h.translations,
      topics: h.topics,
      relations: h.relations,
      references: h.references || {},
      tags: []
    }))
  }));
  return { metadata: rawData.metadata, books: normalizedBooks };
}
module.exports = { normalize };
`;
fs.writeFileSync(path.join(INGEST_DIR, 'normalizer.cjs'), normalizerCode);

// 3. compiler.cjs
const compilerCode = `
const fs = require('fs');
const path = require('path');

function compile(normalizedData, outputDir) {
  console.log('Compiling Hadith datasets...');
  const compiledDir = path.join(outputDir, 'compiled');
  const collectionDir = path.join(compiledDir, 'collections', normalizedData.metadata.id);

  fs.mkdirSync(collectionDir, { recursive: true });

  // Metadata
  fs.writeFileSync(
    path.join(collectionDir, 'metadata.json'), 
    JSON.stringify(normalizedData.metadata, null, 2)
  );

  const searchIndex = [];

  normalizedData.books.forEach(book => {
    const bookStr = \`book-\${String(book.number).padStart(3, '0')}\`;
    
    fs.writeFileSync(path.join(collectionDir, \`\${bookStr}.json\`), JSON.stringify(book, null, 2));

    // Search Index
    book.hadiths.forEach(h => {
      searchIndex.push({
        nodeId: h.id,
        collection: h.collection,
        book: h.book,
        number: h.number,
        arabic: h.arabic,
        english: h.translations.en || '',
        urdu: h.translations.ur || ''
      });
    });
  });

  fs.writeFileSync(path.join(compiledDir, \`search-index-\${normalizedData.metadata.id}.json\`), JSON.stringify(searchIndex));
  console.log('Hadith Search index generated.');
}
module.exports = { compile };
`;
fs.writeFileSync(path.join(INGEST_DIR, 'compiler.cjs'), compilerCode);

// 4. run.cjs
const runCode = `
const path = require('path');
const { importData } = require('./importers/dummy.cjs');
const { normalize } = require('./normalizer.cjs');
const { compile } = require('./compiler.cjs');

async function run() {
  try {
    const rawData = await importData();
    const normalizedData = normalize(rawData);
    const outputDir = path.join(__dirname, '..', '..', 'src', 'content', 'hadith');
    compile(normalizedData, outputDir);
    console.log('Hadith Pipeline complete!');
  } catch (err) {
    console.error('Hadith Pipeline failed:', err);
    process.exit(1);
  }
}
run();
`;
fs.writeFileSync(path.join(INGEST_DIR, 'run.cjs'), runCode);

console.log('Hadith Ingestion Scripts Scaffolded.');
