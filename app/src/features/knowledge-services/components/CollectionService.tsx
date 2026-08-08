import { useState } from 'react';
import { IconButton } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { ServiceComponentProps } from '../types';
import { useReader } from '../../reader/context/ReaderContext';
import { useLibrary } from '../hooks/useLibrary';
import { Stack } from '../../../design/primitives/Stack';
import { Caption } from '../../../design/typography/BasicText';

export function CollectionService({ node }: ServiceComponentProps) {
  const { openPanel } = useReader();

  const handleCollections = () => {
    openPanel({
      title: 'Save to Collection',
      type: 'reference',
      content: <CollectionManager nodeId={node.id} />
    });
  };

  return (
    <IconButton variant="ghost" title="Save to Collection" onClick={handleCollections}>
      <Icon name="FolderPlus" size={18} />
    </IconButton>
  );
}

function CollectionManager({ nodeId }: { nodeId: string }) {
  const { getCollections, toggleInCollection, createCollection, isInCollection } = useLibrary();
  const [newCollectionName, setNewCollectionName] = useState('');
  
  // We need to trigger re-renders when toggling collections
  const collections = getCollections();

  const handleCreate = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
    }
  };

  return (
    <Stack space={4}>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name..." 
          className="flex-1 px-3 py-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button 
          onClick={handleCreate}
          disabled={!newCollectionName.trim()}
          className="px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-all disabled:opacity-50"
        >
          Create
        </button>
      </div>

      <Stack space={2} className="mt-4">
        <Caption className="uppercase tracking-widest text-[var(--text-secondary)] font-semibold mb-1">Your Collections</Caption>
        {collections.length === 0 ? (
          <Caption className="text-[var(--text-secondary)] italic">No collections yet.</Caption>
        ) : (
          collections.map(c => {
            const active = isInCollection(c.id, nodeId);
            return (
              <label key={c.id} className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg hover:bg-[var(--surface-elevated)] cursor-pointer transition-colors">
                <input 
                  type="checkbox" 
                  checked={active}
                  onChange={() => toggleInCollection(c.id, nodeId)}
                  className="w-4 h-4 text-[var(--primary)] focus:ring-[var(--primary)] rounded border-[var(--border)]"
                />
                <span className="text-sm font-medium capitalize">{c.id.replace('-', ' ')}</span>
              </label>
            );
          })
        )}
      </Stack>
    </Stack>
  );
}
