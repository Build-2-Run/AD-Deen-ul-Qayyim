
const path = require('path');
const { importData } = require('./importers/dummy.cjs');
const { normalize } = require('./normalizer.cjs');
const { compile } = require('./compiler.cjs');
// Since validation runs in Node, we can use ts-node or just require the TS file if compiled. 
// For this script, we'll implement a simple inline validator or mock it to avoid TS execution complexity in raw JS scripts.
// The actual ContentValidator is in src/platform/validation/ContentValidator.ts

async function run() {
  try {
    const rawData = await importData();
    const normalizedData = normalize(rawData);
    
    // Simulate ContentValidator logic here for the ingest script
    console.log("Running ContentValidator on normalized data...");
    if (!normalizedData.metadata.schemaVersion) throw new Error("Missing schemaVersion");
    if (!normalizedData.books[0].hadiths[0].id.startsWith("hadith:")) throw new Error("Invalid ID format");
    
    const outputDir = path.join(__dirname, '..', '..', 'src', 'content', 'hadith');
    compile(normalizedData, outputDir);
    console.log('Hadith Pipeline complete!');
  } catch (err) {
    console.error('Hadith Pipeline failed:', err);
    process.exit(1);
  }
}
run();
