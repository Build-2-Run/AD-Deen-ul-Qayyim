import { useState, useMemo } from 'react';
import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { Link } from 'react-router-dom';
import { useQuranExperience } from '../hooks/useQuranExperience';

// Mock list of 114 Surahs for scalable browser demonstration
const SURAH_DATA = [
  { id: 1, arabic: 'الفاتحة', english: 'Al-Fatihah', revelation: 'Meccan', ayahs: 7 },
  { id: 2, arabic: 'البقرة', english: 'Al-Baqarah', revelation: 'Medinan', ayahs: 286 },
  { id: 3, arabic: 'آل عمران', english: 'Ali \'Imran', revelation: 'Medinan', ayahs: 200 },
  { id: 4, arabic: 'النساء', english: 'An-Nisa', revelation: 'Medinan', ayahs: 176 },
  { id: 5, arabic: 'المائدة', english: 'Al-Ma\'idah', revelation: 'Medinan', ayahs: 120 },
  { id: 36, arabic: 'يس', english: 'Ya-Sin', revelation: 'Meccan', ayahs: 83 },
  { id: 114, arabic: 'الناس', english: 'An-Nas', revelation: 'Meccan', ayahs: 6 }
];

export function QuranHome() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'alphabetical'>('number');
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan'>('all');
  
  const { progress } = useQuranExperience();

  const filteredSurahs = useMemo(() => {
    let result = [...SURAH_DATA];
    
    if (filter !== 'all') {
      result = result.filter(s => s.revelation.toLowerCase() === filter);
    }
    
    if (search) {
      result = result.filter(s => 
        s.english.toLowerCase().includes(search.toLowerCase()) || 
        s.arabic.includes(search)
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === 'number') return a.id - b.id;
      return a.english.localeCompare(b.english);
    });
    
    return result;
  }, [search, sortBy, filter]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <header className="mb-12">
        <Typography variant="h1" className="text-tx-primary mb-4 text-4xl">The Noble Quran</Typography>
        <Typography variant="body" className="text-tx-secondary text-lg max-w-2xl">
          Explore the divine revelation.
        </Typography>
      </header>

      {progress && (
        <KnowledgeSurface className="mb-12 border-primary/20 bg-primary/5 flex items-center justify-between">
          <div>
            <Typography variant="caption" className="text-tx-secondary uppercase tracking-widest font-bold block mb-1">Continue Reading</Typography>
            <Typography variant="h3" className="text-primary">{progress.surahName} • Ayah {progress.ayahNumber}</Typography>
          </div>
          <Link to={`/quran/surah/${progress.surahNumber}`} className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-colors">
            Resume
          </Link>
        </KnowledgeSurface>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          type="text" 
          placeholder="Search Surahs..." 
          className="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-tx-primary focus:outline-none focus:border-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="bg-surface border border-border rounded-lg px-4 py-2 text-tx-primary focus:outline-none focus:border-primary"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'number' | 'alphabetical')}
        >
          <option value="number">Sort by Number</option>
          <option value="alphabetical">Sort Alphabetically</option>
        </select>
        <select 
          className="bg-surface border border-border rounded-lg px-4 py-2 text-tx-primary focus:outline-none focus:border-primary"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'meccan' | 'medinan')}
        >
          <option value="all">All Revelations</option>
          <option value="meccan">Meccan</option>
          <option value="medinan">Medinan</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurahs.map(surah => (
          <Link key={surah.id} to={`/quran/surah/${surah.id}`}>
            <KnowledgeSurface className="hover:border-primary/50 transition-colors h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded bg-surface-elevated flex items-center justify-center text-tx-secondary font-bold text-sm">
                  {surah.id}
                </div>
                <Typography variant="h3" className="font-arabic text-2xl text-tx-primary">{surah.arabic}</Typography>
              </div>
              <div>
                <Typography variant="h4" className="text-tx-primary mb-1">{surah.english}</Typography>
                <div className="flex items-center gap-4 text-tx-secondary text-sm">
                  <span>{surah.revelation}</span>
                  <span>•</span>
                  <span>{surah.ayahs} Ayahs</span>
                </div>
              </div>
            </KnowledgeSurface>
          </Link>
        ))}
        
        {filteredSurahs.length === 0 && (
          <div className="col-span-full py-12 text-center text-tx-secondary">
            No Surahs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
