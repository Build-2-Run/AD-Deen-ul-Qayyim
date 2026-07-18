import React, { useEffect, useState } from 'react';
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
            <Link to={`/hadith/${collection}/${b.number}/1`} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
              Read Hadiths
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
