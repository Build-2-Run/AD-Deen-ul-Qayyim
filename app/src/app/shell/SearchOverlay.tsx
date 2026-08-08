import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../design/components/Dialog";
import { SearchInput } from "../../design/components/Input";
import { Icon, IconName } from "../../design/icons/Icon";
import { Stack } from "../../design/primitives/Stack";
import { Body, Caption } from "../../design/typography/BasicText";
import { Flex } from "../../design/primitives/Flex";
import { Link } from "react-router-dom";

// Mock data structures for the UI
const RECENT_SEARCHES = [
  { label: "Inheritance Calculator", to: "/calculators/mirath", type: "tool" },
  { label: "Surah Al-Mulk", to: "/quran/67", type: "quran" },
  { label: "Tahajjud prayer times", to: "/worship/prayer", type: "topic" }
];

const SUGGESTED_TOPICS = [
  "Zakat Rules", "Morning Adhkar", "Prophet Musa", "Ramadan Fasting"
];

// Mock grouped results shown when typing
const MOCK_RESULTS = {
  Quran: [
    { label: "Surah Ya-Sin", subtitle: "Chapter 36", to: "/quran/36" },
    { label: "Ayatul Kursi", subtitle: "Al-Baqarah (2:255)", to: "/quran/2/255" },
  ],
  Hadith: [
    { label: "Actions are by intentions", subtitle: "Sahih al-Bukhari 1", to: "/hadith/bukhari/1/1" },
  ],
  Tools: [
    { label: "Zakat Calculator", subtitle: "Calculate your annual wealth purification", to: "/calculators/zakat" },
  ]
};

function ResultItem({ label, subtitle, to, icon }: { label: string, subtitle?: string, to: string, icon: IconName }) {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--surface-elevated)] rounded-xl group transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
    >
      <div className="bg-[var(--surface)] p-2 rounded-lg text-[var(--text-secondary)] group-hover:text-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-colors">
        <Icon name={icon} size={20} />
      </div>
      <Stack space={1} className="flex-1">
        <Body weight="medium" className="group-hover:text-[var(--primary)] transition-colors">{label}</Body>
        {subtitle && <Caption className="text-[var(--text-secondary)] line-clamp-1">{subtitle}</Caption>}
      </Stack>
      <Icon name="ChevronRight" size={16} className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0" />
    </Link>
  );
}

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Clear query when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => setQuery(""), 200);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 h-9 rounded-md bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] w-10 md:w-64">
          <Icon name="Search" size={16} />
          <span className="hidden md:inline-block text-sm">Search ADQ...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 ml-auto text-[10px] font-medium bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl p-0 overflow-hidden top-[20%] translate-y-0 gap-0 rounded-2xl">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)]">
          <SearchInput 
            placeholder="Search Quran, Hadith, or topics..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-14 text-lg border-none bg-transparent shadow-none focus-visible:ring-0 px-0" 
            autoFocus 
          />
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query ? (
            <Flex direction="col" className="gap-6 p-4">
              <Stack space={3}>
                <Caption className="uppercase tracking-wider font-semibold text-[var(--text-secondary)]">Recent Searches</Caption>
                <Flex direction="col" className="gap-1">
                  {RECENT_SEARCHES.map((item) => (
                    <Link key={item.label} to={item.to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors group">
                      <Icon name="History" size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--primary)]" />
                      <Body className="group-hover:text-[var(--primary)]">{item.label}</Body>
                    </Link>
                  ))}
                </Flex>
              </Stack>
              
              <Stack space={3}>
                <Caption className="uppercase tracking-wider font-semibold text-[var(--text-secondary)]">Suggested Topics</Caption>
                <Flex wrap="wrap" className="gap-2">
                  {SUGGESTED_TOPICS.map((topic) => (
                    <button key={topic} onClick={() => setQuery(topic)} className="px-3 py-1.5 rounded-full bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-sm hover:bg-[var(--primary)] hover:text-white transition-colors">
                      {topic}
                    </button>
                  ))}
                </Flex>
              </Stack>
            </Flex>
          ) : (
            <Flex direction="col" className="gap-6 p-2">
              <Stack space={2}>
                <Caption className="uppercase tracking-wider font-semibold text-[var(--text-secondary)] px-4">Quran</Caption>
                <Flex direction="col">
                  {MOCK_RESULTS.Quran.map((res) => (
                    <ResultItem key={res.label} label={res.label} subtitle={res.subtitle} to={res.to} icon="BookOpen" />
                  ))}
                </Flex>
              </Stack>
              <Stack space={2}>
                <Caption className="uppercase tracking-wider font-semibold text-[var(--text-secondary)] px-4">Hadith</Caption>
                <Flex direction="col">
                  {MOCK_RESULTS.Hadith.map((res) => (
                    <ResultItem key={res.label} label={res.label} subtitle={res.subtitle} to={res.to} icon="Scroll" />
                  ))}
                </Flex>
              </Stack>
              <Stack space={2}>
                <Caption className="uppercase tracking-wider font-semibold text-[var(--text-secondary)] px-4">Tools & Calculators</Caption>
                <Flex direction="col">
                  {MOCK_RESULTS.Tools.map((res) => (
                    <ResultItem key={res.label} label={res.label} subtitle={res.subtitle} to={res.to} icon="Calculator" />
                  ))}
                </Flex>
              </Stack>
            </Flex>
          )}
        </div>
        
        <div className="bg-[var(--surface-elevated)] border-t border-[var(--border)] p-3 flex items-center justify-between">
          <Caption className="text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">Pro Tip:</span> Use <kbd className="font-mono bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">↑</kbd> <kbd className="font-mono bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">↓</kbd> to navigate and <kbd className="font-mono bg-[var(--surface)] px-1 py-0.5 rounded border border-[var(--border)]">Enter</kbd> to select
          </Caption>
          <div className="hidden sm:flex items-center gap-3">
            <Icon name="Command" size={14} className="text-[var(--text-secondary)]" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
