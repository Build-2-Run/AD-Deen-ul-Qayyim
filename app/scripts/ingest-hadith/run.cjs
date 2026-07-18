
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
