import { useState } from 'react';
import { IconButton } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { ServiceComponentProps } from '../types';
import { useReader } from '../../reader/context/ReaderContext';
import { useLibrary } from '../hooks/useLibrary';
import { Stack } from '../../../design/primitives/Stack';
import { Flex } from '../../../design/primitives/Flex';
import { cn } from '../../../utils/cn';

export function NotesService({ node }: ServiceComponentProps) {
  const { openPanel, closePanel } = useReader();
  const { getNote, saveNote } = useLibrary();
  
  const existingNote = getNote(node.id);

  const handleNotes = () => {
    openPanel({
      title: 'Personal Notes',
      type: 'reference',
      content: <NotesEditor nodeId={node.id} initialContent={getNote(node.id) || ''} onSave={saveNote} onClose={closePanel} />
    });
  };

  return (
    <IconButton 
      variant="ghost" 
      title="Notes" 
      onClick={handleNotes}
      className={cn(existingNote && "text-[var(--primary)]")}
    >
      <Icon name="Edit3" size={18} className={cn(existingNote && "fill-[var(--primary)]/20")} />
    </IconButton>
  );
}

// Extracted editor component to manage internal state cleanly
function NotesEditor({ nodeId, initialContent, onSave, onClose }: { nodeId: string, initialContent: string, onSave: (id: string, content: string) => void, onClose: () => void }) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(nodeId, content);
    onClose();
  };

  return (
    <Stack space={4}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reflections here... (Plain text only)"
        className="w-full h-48 p-4 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg resize-none outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
      />
      <Flex justify="end" className="gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
          Save Note
        </button>
      </Flex>
    </Stack>
  );
}
