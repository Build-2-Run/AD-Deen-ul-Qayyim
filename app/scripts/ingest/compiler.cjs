const fs = require('fs');
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
    fs.writeFileSync(path.join(surahsDir, `${sNumStr}.json`), JSON.stringify(baseSurah, null, 2));

    // Translations
    const enTrans = {
      surah: sNum,
      translation: 'en',
      author: 'sahih',
      ayahs: surah.ayahs.map(a => ({ number: a.number, text: a.en }))
    };
    fs.writeFileSync(path.join(transEnDir, `${sNumStr}.json`), JSON.stringify(enTrans, null, 2));

    const urTrans = {
      surah: sNum,
      translation: 'ur',
      author: 'jalandhry',
      ayahs: surah.ayahs.map(a => ({ number: a.number, text: a.ur }))
    };
    fs.writeFileSync(path.join(transUrDir, `${sNumStr}.json`), JSON.stringify(urTrans, null, 2));

    // Search Index
    surah.ayahs.forEach(a => {
      searchIndex.push({
        nodeId: `quran-${sNum}-${a.number}`,
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
