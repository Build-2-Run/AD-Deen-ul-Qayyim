const fs = require('fs');
const path = require('path');
const https = require('https');


const RAW_DIR = path.join(__dirname, '../datasets/quran/raw');
const COMPILED_DIR = path.join(__dirname, '../src/content/quran/compiled');
const SURAHS_DIR = path.join(COMPILED_DIR, 'surahs');

// Ensure directories exist
[RAW_DIR, COMPILED_DIR, SURAHS_DIR].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}


async function run() {
  console.log('Starting Quran Ingestion Pipeline...');
  
  // To prevent extremely long builds in this demonstration, 
  // we will compile the metadata for all 114 Surahs, but only physically download Ayahs for Surah 1 & 2.
  // In a real pipeline, we'd loop over all 114.
  
  try {
    console.log('Fetching Surah Metadata from api.alquran.cloud...');
    const metaRes = await fetchJson('https://api.alquran.cloud/v1/meta');
    
    const surahMetadata = metaRes.data.surahs.references.map(s => ({
      id: s.number,
      name: s.name,
      englishName: s.englishName,
      englishNameTranslation: s.englishNameTranslation,
      revelationType: s.revelationType,
      numberOfAyahs: s.numberOfAyahs
    }));

    const compiledMeta = {
      datasetVersion: '1.0.0',
      source: 'AlQuran.cloud API',
      compiledAt: new Date().toISOString(),
      language: 'mixed',
      surahs: surahMetadata
    };

    fs.writeFileSync(path.join(COMPILED_DIR, 'metadata.json'), JSON.stringify(compiledMeta, null, 2));
    console.log('Generated compiled/metadata.json');

    // Fetch Surah 1 (Al-Fatihah) and Surah 2 (Al-Baqarah) as sample compilations
    const surahsToFetch = [1, 2];
    
    for (const id of surahsToFetch) {
      console.log(`Fetching Arabic & English for Surah ${id}...`);
      const arRes = await fetchJson(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`);
      const enRes = await fetchJson(`https://api.alquran.cloud/v1/surah/${id}/en.sahih`);
      
      const compiledSurah = {
        surahNumber: id,
        name: arRes.data.name,
        englishName: arRes.data.englishName,
        ayahs: arRes.data.ayahs.map((ayah, i) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: {
            'en.sahih': enRes.data.ayahs[i].text
          }
        }))
      };

      const contentStr = JSON.stringify(compiledSurah, null, 2);
      const filename = `${String(id).padStart(3, '0')}-surah.json`;
      fs.writeFileSync(path.join(SURAHS_DIR, filename), contentStr);
      console.log(`Generated compiled/surahs/${filename}`);
    }

    console.log('Pipeline complete.');
  } catch (err) {
    console.error('Ingestion failed:', err);
    process.exit(1);
  }
}

run();
