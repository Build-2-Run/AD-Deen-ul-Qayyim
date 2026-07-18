
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
    const bookStr = `book-${String(book.number).padStart(3, '0')}`;
    
    fs.writeFileSync(path.join(collectionDir, `${bookStr}.json`), JSON.stringify(book, null, 2));

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

  fs.writeFileSync(path.join(compiledDir, `search-index-${normalizedData.metadata.id}.json`), JSON.stringify(searchIndex));
  console.log('Hadith Search index generated.');
}
module.exports = { compile };
