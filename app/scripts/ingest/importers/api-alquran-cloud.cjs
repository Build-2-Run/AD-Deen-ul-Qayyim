const https = require('https');

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
