const fs = require('fs');
const path = require('path');

const INGEST_DIR = path.join(__dirname, 'scripts', 'ingest');
const IMPORTERS_DIR = path.join(INGEST_DIR, 'importers');
if (!fs.existsSync(IMPORTERS_DIR)) fs.mkdirSync(IMPORTERS_DIR, { recursive: true });

// 1. Importer (api-alquran-cloud.cjs)
const importerCode = `const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Islamic-Hub/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function importData() {
  console.log('Fetching Metadata...');
  const meta = await fetchJson('https://api.alquran.cloud/v1/meta');
  
  console.log('Fetching Arabic (Uthmani)...');
  const arabic = await fetchJson('https://api.alquran.cloud/v1/quran/quran-uthmani');
  
  console.log('Fetching English (Sahih)...');
  const english = await fetchJson('https://api.alquran.cloud/v1/quran/en.sahih');
  
  console.log('Fetching Urdu (Jalandhry)...');
  const urdu = await fetchJson('https://api.alquran.cloud/v1/quran/ur.jalandhry');

  return { meta: meta.data, arabic: arabic.data, english: english.data, urdu: urdu.data };
}

module.exports = { importData };
`;
fs.writeFileSync(path.join(IMPORTERS_DIR, 'api-alquran-cloud.cjs'), importerCode);

// 2. Normalizer (normalizer.cjs)
const normalizerCode = `function normalize(rawData) {
  console.log('Normalizing data...');
  const { meta, arabic, english, urdu } = rawData;
  
  const surahs = meta.surahs.references.map(s => ({
    id: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    revelationType: s.revelationType,
    numberOfAyahs: s.numberOfAyahs
  }));

  const normalizedSurahs = [];
  
  for (let i = 0; i < 114; i++) {
    const arSurah = arabic.surahs[i];
    const enSurah = english.surahs[i];
    const urSurah = urdu.surahs[i];

    const ayahs = arSurah.ayahs.map((ayah, index) => ({
      number: ayah.numberInSurah,
      arabic: ayah.text,
      en: enSurah.ayahs[index].text,
      ur: urSurah.ayahs[index].text
    }));

    normalizedSurahs.push({
      metadata: surahs[i],
      ayahs
    });
  }

  return { metadata: { surahs }, normalizedSurahs };
}
module.exports = { normalize };
`;
fs.writeFileSync(path.join(INGEST_DIR, 'normalizer.cjs'), normalizerCode);

// 3. Compiler (compiler.cjs)
const compilerCode = `const fs = require('fs');
const path = require('path');

function compile(normalizedData, outputDir) {
  console.log('Compiling datasets...');
  const compiledDir = path.join(outputDir, 'compiled');
  const surahsDir = path.join(compiledDir, 'surahs');
  const transEnDir = path.join(compiledDir, 'translations', 'en', 'sahih');
  const transUrDir = path.join(compiledDir, 'translations', 'ur', 'jalandhry');

  [surahsDir, transEnDir, transUrDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

  // Metadata
  fs.writeFileSync(
    path.join(compiledDir, 'metadata.json'), 
    JSON.stringify(normalizedData.metadata, null, 2)
  );

  const searchIndex = [];

  normalizedData.normalizedSurahs.forEach(surah => {
    const sNum = surah.metadata.id;
    const sNumStr = String(sNum).padStart(3, '0');

    // Arabic base
    const baseSurah = {
      ...surah.metadata,
      ayahs: surah.ayahs.map(a => ({ number: a.number, arabic: a.arabic }))
    };
    fs.writeFileSync(path.join(surahsDir, \`\${sNumStr}.json\`), JSON.stringify(baseSurah, null, 2));

    // Translations
    const enTrans = {
      surah: sNum,
      translation: 'en',
      author: 'sahih',
      ayahs: surah.ayahs.map(a => ({ number: a.number, text: a.en }))
    };
    fs.writeFileSync(path.join(transEnDir, \`\${sNumStr}.json\`), JSON.stringify(enTrans, null, 2));

    const urTrans = {
      surah: sNum,
      translation: 'ur',
      author: 'jalandhry',
      ayahs: surah.ayahs.map(a => ({ number: a.number, text: a.ur }))
    };
    fs.writeFileSync(path.join(transUrDir, \`\${sNumStr}.json\`), JSON.stringify(urTrans, null, 2));

    // Search Index
    surah.ayahs.forEach(a => {
      searchIndex.push({
        nodeId: \`quran-\${sNum}-\${a.number}\`,
        surah: sNum,
        ayah: a.number,
        arabic: a.arabic,
        english: a.en,
        urdu: a.ur
      });
    });
  });

  fs.writeFileSync(path.join(compiledDir, 'search-index.json'), JSON.stringify(searchIndex));
  console.log('Search index generated.');
}
module.exports = { compile };
`;
fs.writeFileSync(path.join(INGEST_DIR, 'compiler.cjs'), compilerCode);

// 4. Runner (run.cjs)
const runnerCode = `const path = require('path');
const { importData } = require('./importers/api-alquran-cloud.cjs');
const { normalize } = require('./normalizer.cjs');
const { compile } = require('./compiler.cjs');

async function run() {
  try {
    const rawData = await importData();
    const normalizedData = normalize(rawData);
    const outputDir = path.join(__dirname, '..', '..', 'src', 'content', 'quran');
    compile(normalizedData, outputDir);
    console.log('Pipeline complete!');
  } catch (err) {
    console.error('Pipeline failed:', err);
    process.exit(1);
  }
}
run();
`;
fs.writeFileSync(path.join(INGEST_DIR, 'run.cjs'), runnerCode);

console.log('Ingestion scripts created.');
