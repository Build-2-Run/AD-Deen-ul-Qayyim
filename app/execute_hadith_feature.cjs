const fs = require('fs');
const path = require('path');

const HADITH_DIR = path.join(__dirname, 'src', 'features', 'hadith');
const PAGES_DIR = path.join(HADITH_DIR, 'pages');
const COMPONENTS_DIR = path.join(HADITH_DIR, 'components');

[HADITH_DIR, PAGES_DIR, COMPONENTS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. HadithSidebar.tsx
const sidebarCode = `import React from 'react';
import { useReader } from '../../../platform/reader/ReaderLayout';

export const HadithSidebar: React.FC<{ hadithNode: any }> = ({ hadithNode }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Hadith Info</h3>
      <div className="mb-4">
        <span className="text-sm text-gray-500 block">Grade</span>
        <span className={\`inline-block px-2 py-1 rounded text-sm \${
          hadithNode.grade === 'Sahih' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
        }\`}>
          {hadithNode.grade}
        </span>
      </div>
      {hadithNode.topics && hadithNode.topics.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-gray-500 block mb-1">Topics</span>
          <div className="flex flex-wrap gap-2">
            {hadithNode.topics.map((t: string) => (
              <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{t}</span>
            ))}
          </div>
        </div>
      )}
      {hadithNode.relations && hadithNode.relations.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-gray-500 block mb-1">Related Quran Ayat</span>
          <ul className="text-sm space-y-1">
            {hadithNode.relations.map((r: string) => (
              <li key={r} className="text-blue-600 hover:underline cursor-pointer">{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'HadithSidebar.tsx'), sidebarCode);

// 2. HadithPage.tsx
const hadithPageCode = `import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReaderLayout } from '../../../platform/reader/ReaderLayout';
import { DatasetRegistry } from '../../../platform/registry/DatasetRegistry';
import { HadithSidebar } from '../components/HadithSidebar';

export const HadithPage: React.FC = () => {
  const { collection, book, number } = useParams();
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    const nodeId = \`hadith:\${collection}:\${book}:\${number}\`;
    DatasetRegistry.loadNode(nodeId).then(n => setNode(n));
  }, [collection, book, number]);

  if (!node) return <div className="p-8 text-center">Loading Hadith...</div>;

  return (
    <ReaderLayout 
      header={<h1 className="text-xl font-bold">Hadith {node.number}</h1>}
      rightSidebar={<HadithSidebar hadithNode={node} />}
    >
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <div className="text-3xl text-right leading-loose font-arabic" dir="rtl">
          {node.arabic}
        </div>
        <div className="text-lg text-gray-800 leading-relaxed">
          {node.translations?.en}
        </div>
      </div>
    </ReaderLayout>
  );
};
`;
fs.writeFileSync(path.join(PAGES_DIR, 'HadithPage.tsx'), hadithPageCode);

// 3. CollectionPage.tsx
const collectionPageCode = `import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DatasetRegistry } from '../../../platform/registry/DatasetRegistry';

export const CollectionPage: React.FC = () => {
  const { collection } = useParams();
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    if (collection) {
      DatasetRegistry.loadCollection(collection).then(m => setMetadata(m));
    }
  }, [collection]);

  if (!metadata) return <div className="p-8 text-center">Loading Collection...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{metadata.name}</h1>
      <p className="text-gray-600 mb-8">{metadata.description}</p>
      
      <h2 className="text-xl font-semibold mb-4">Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metadata.books?.map((b: any) => (
          <div key={b.id} className="p-4 border rounded shadow-sm hover:shadow-md transition">
            <h3 className="font-bold">{b.number}. {b.name}</h3>
            <p className="text-sm text-gray-500 font-arabic">{b.arabicName}</p>
            {/* For Milestone 1, link directly to the first hadith of the book */}
            <Link to={\`/hadith/\${collection}/\${b.number}/1\`} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              Read Hadiths
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
`;
fs.writeFileSync(path.join(PAGES_DIR, 'CollectionPage.tsx'), collectionPageCode);

// 4. HadithHome.tsx
const hadithHomeCode = `import React from 'react';
import { Link } from 'react-router-dom';

export const HadithHome: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Hadith Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/hadith/bukhari" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Sahih al-Bukhari</h5>
          <p className="font-normal text-gray-700">The most authentic book of Hadith in Sunni Islam.</p>
        </Link>
        {/* Placeholders for others */}
        <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Sahih Muslim</h5>
          <p className="font-normal text-gray-700">Coming soon.</p>
        </div>
      </div>
    </div>
  );
};
`;
fs.writeFileSync(path.join(PAGES_DIR, 'HadithHome.tsx'), hadithHomeCode);

// 5. Index for easy imports
const indexCode = `
export { HadithHome } from './pages/HadithHome';
export { CollectionPage } from './pages/CollectionPage';
export { HadithPage } from './pages/HadithPage';
`;
fs.writeFileSync(path.join(HADITH_DIR, 'index.ts'), indexCode);

console.log('Hadith feature module scaffolded.');
