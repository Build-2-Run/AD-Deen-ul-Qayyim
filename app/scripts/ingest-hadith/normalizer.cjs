
function normalize(rawData) {
  const normalizedBooks = rawData.books.map(book => ({
    ...book,
    hadiths: book.hadiths.map(h => ({
      id: `hadith:${rawData.metadata.id}:${book.number}:${h.number}`,
      collection: rawData.metadata.id,
      book: book.number,
      chapter: null,
      number: h.number,
      grade: h.grade,
      arabic: h.arabic,
      translations: h.translations,
      topics: h.topics,
      relations: h.relations,
      tags: []
    }))
  }));
  return { metadata: rawData.metadata, books: normalizedBooks };
}
module.exports = { normalize };
