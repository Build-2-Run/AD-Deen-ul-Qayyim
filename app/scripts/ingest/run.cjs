const path = require('path');
const { importData } = require('./importers/api-alquran-cloud.cjs');
const { normalize } = require('./normalizer.cjs');
const { compile } = require('./compiler.cjs');

async function run() {
  try {
    const rawData = await importData();
    console.log("Normalizing data...");
    const normalizedData = normalize(rawData);

    console.log("Running ContentValidator on normalized data...");
    if (!normalizedData.metadata.schemaVersion) throw new Error("Missing schemaVersion");

    const outputDir = path.join(__dirname, '..', '..', 'src', 'content', 'quran');
    compile(normalizedData, outputDir);
    console.log('Pipeline complete!');
  } catch (err) {
    console.error('Pipeline failed:', err);
    process.exit(1);
  }
}
run();
