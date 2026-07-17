const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/KnowledgeGateway.tsx': `import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Stack } from '../components/layout/Stack';
import { Grid } from '../components/layout/Grid';
import { KnowledgeSurface } from '../components/common/KnowledgeSurface';

export function KnowledgeGateway() {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-500">
      
      {/* 1. Welcome Section */}
      <section className="bg-surface border border-border p-6 md:p-10 rounded-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
          {/* Decorative placeholder */}
          <div className="w-64 h-64 rounded-full border-[20px] border-primary"></div>
        </div>
        <Stack spacing={4} className="relative z-10">
          <Typography variant="caption" className="text-primary font-arabic text-xl tracking-wider">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</Typography>
          <Typography variant="h1" className="tracking-tight text-tx-primary">As-salamu alaykum, Learner.</Typography>
          <Typography variant="body" className="text-tx-secondary max-w-2xl">"Seeking knowledge is an obligation upon every Muslim." — Sunan Ibn Majah 224</Typography>
        </Stack>
      </section>

      <div className="px-2 md:px-0 space-y-16">
        
        {/* 2. Today's Learning Focus */}
        <section>
          <Typography variant="h2" className="mb-6 text-tx-primary">Today's Focus</Typography>
          <KnowledgeSurface className="border-l-4 border-l-primary relative overflow-hidden">
            <Stack spacing={4}>
              <Typography variant="small" className="uppercase tracking-widest text-tx-secondary font-bold">Featured Ayah</Typography>
              <Typography variant="h3" className="font-arabic text-3xl leading-relaxed text-tx-primary">فَإِنَّ مَعَ الْعُسْرِ يُسْرًا</Typography>
              <Typography variant="body" className="text-tx-secondary">"For indeed, with hardship [will be] ease." (Ash-Sharh 94:5)</Typography>
              <div className="pt-4">
                <Button variant="primary">Continue Learning</Button>
              </div>
            </Stack>
          </KnowledgeSurface>
        </section>

        <Grid cols={1} mdCols={2} lgCols={2} gap={8}>
          {/* 3. Continue Learning */}
          <section>
            <Typography variant="h2" className="mb-6 text-tx-primary">Resume</Typography>
            <Stack spacing={4}>
              <KnowledgeSurface onClick={() => {}}>
                <Typography variant="h3" className="mb-2 text-tx-primary">Inheritance Calculator</Typography>
                <Typography variant="small" className="text-tx-secondary mb-4 block">Last visited: 2 days ago</Typography>
                <div className="w-full bg-background rounded-full h-2.5 border border-border">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <Typography variant="caption" className="mt-2 text-right block text-tx-secondary">45% Complete</Typography>
              </KnowledgeSurface>
            </Stack>
          </section>

          {/* 4. Prayer & Islamic Calendar */}
          <section>
            <Typography variant="h2" className="mb-6 text-tx-primary">Time & Prayer</Typography>
            <KnowledgeSurface className="h-full flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="caption" className="text-tx-secondary uppercase font-bold tracking-wider">Current</Typography>
                  <Typography variant="h3" className="text-primary mt-1">Dhuhr</Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-tx-secondary uppercase font-bold tracking-wider">Next (Asr)</Typography>
                  <Typography variant="h3" className="text-tx-primary mt-1">in 2h 15m</Typography>
                </div>
                <div className="col-span-2 pt-4 border-t border-border/50 mt-2">
                  <Typography variant="body" className="font-medium text-tx-primary">14 Muharram 1448 AH</Typography>
                  <Typography variant="small" className="text-tx-secondary block mt-1">Upcoming Event: Ashura</Typography>
                </div>
              </div>
            </KnowledgeSurface>
          </section>
        </Grid>

        {/* 5. Explore Knowledge */}
        <section>
          <Typography variant="h2" className="mb-6 text-tx-primary">Explore Knowledge</Typography>
          {/* Using a raw grid class for 4 cols to ensure tailwind picks it up, as dynamic strings might miss */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Quran", "Hadith", "Seerah", "Aqeedah", 
              "Fiqh", "History", "Prophets", "Nature", 
              "Astronomy", "Mirath", "Zakat", "Qurbani", 
              "Duas", "Asma-ul-Husna"
            ].map((topic) => (
              <KnowledgeSurface key={topic} onClick={() => {}} className="text-center py-8 group">
                <Typography variant="h3" className="text-tx-primary group-hover:text-primary transition-colors text-lg md:text-xl">{topic}</Typography>
              </KnowledgeSurface>
            ))}
          </div>
        </section>

        <Grid cols={1} mdCols={2} lgCols={2} gap={8}>
          {/* 6. Favorites */}
          <section>
            <Typography variant="h2" className="mb-6 text-tx-primary">Favorites</Typography>
            <Stack spacing={3}>
              {[
                { type: "Ayah", title: "Al-Baqarah 2:255 (Ayatul Kursi)" },
                { type: "Hadith", title: "Actions are by intentions (Bukhari 1)" },
                { type: "Note", title: "Reflections on Sabr and Shukr" },
              ].map((fav, i) => (
                <div key={i} className="p-4 border border-border rounded-lg bg-surface/50 hover:bg-surface-elevated transition-colors cursor-pointer flex justify-between items-center group">
                  <div>
                    <Typography variant="caption" className="text-primary mb-1 block uppercase font-bold tracking-wider">{fav.type}</Typography>
                    <Typography variant="body" className="text-tx-primary">{fav.title}</Typography>
                  </div>
                  <span className="text-tx-secondary group-hover:text-primary transition-colors">→</span>
                </div>
              ))}
            </Stack>
          </section>

          {/* 7. Recent Activity */}
          <section>
            <Typography variant="h2" className="mb-6 text-tx-primary">Recent Activity</Typography>
            <div className="relative border-l-2 border-border/50 ml-3 space-y-6 pb-4 pt-2">
              {[
                { time: "Today", action: "Completed quiz on Prophets" },
                { time: "Yesterday", action: "Read Surah Al-Kahf" },
                { time: "Monday", action: "Calculated Zakat for 2026" }
              ].map((log, i) => (
                <div key={i} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-surface border-2 border-primary rounded-full -left-[7px] top-1.5"></div>
                  <Typography variant="caption" className="text-tx-secondary block mb-1">{log.time}</Typography>
                  <Typography variant="body" className="text-tx-primary">{log.action}</Typography>
                </div>
              ))}
            </div>
          </section>
        </Grid>
        
      </div>
    </div>
  );
}
`,
  'src/App.tsx': `import { ShellLayout } from './components/layout/ShellLayout';
import { KnowledgeGateway } from './pages/KnowledgeGateway';

export default function App() {
  return (
    <ShellLayout>
      <KnowledgeGateway />
    </ShellLayout>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Knowledge Gateway wireframe generation complete.');
