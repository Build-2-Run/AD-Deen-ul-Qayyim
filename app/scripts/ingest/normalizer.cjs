function normalize(rawData) {
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
