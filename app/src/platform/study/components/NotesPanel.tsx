import React, { useState, useEffect } from 'react';
import { X, Save, Edit2, Trash2 } from 'lucide-react';
import { StudyService } from '../StudyService';
import { ReadingNote } from '../engines/NotesEngine';

interface NotesPanelProps {
  nodeId: string;
  onClose: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ nodeId, onClose }) => {
  const [notes, setNotes] = useState<ReadingNote[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchNotes = async () => {
      const result = await StudyService.getNotesByNode(nodeId);
      if (mounted) setNotes(result);
    };
    fetchNotes();

    const refresh = () => fetchNotes();
    const unsubCreated = StudyService.subscribe('NoteCreated', refresh);
    const unsubUpdated = StudyService.subscribe('NoteUpdated', refresh);
    const unsubDeleted = StudyService.subscribe('NoteDeleted', refresh);

    return () => {
      mounted = false;
      unsubCreated();
      unsubUpdated();
      unsubDeleted();
    };
  }, [nodeId]);

  const handleSave = async () => {
    if (!content.trim()) return;
    await StudyService.createNote({
      nodeId,
      title: title.trim() || 'Untitled Note',
      content: content.trim()
    });
    setIsComposing(false);
    setTitle('');
    setContent('');
  };

  const handleDelete = async (id: string) => {
    await StudyService.deleteNote(id);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl w-80">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Notes</h2>
        <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.length === 0 && !isComposing ? (
          <div className="text-center text-sm text-gray-500 py-8">
            No notes for this section yet.
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{note.title}</h3>
                <button onClick={() => handleDelete(note.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}

        {isComposing && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg space-y-3">
            <input 
              type="text" 
              placeholder="Note Title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 outline-none text-sm font-medium pb-1 text-gray-900 dark:text-gray-100"
            />
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full bg-transparent outline-none resize-none h-32 text-sm text-gray-700 dark:text-gray-300"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsComposing(false)} className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center">
                <Save className="w-3 h-3 mr-1" /> Save
              </button>
            </div>
          </div>
        )}
      </div>

      {!isComposing && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setIsComposing(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      )}
    </div>
  );
};
