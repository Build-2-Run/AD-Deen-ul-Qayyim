import { AppModule } from './types';
import { 
  BookOpen, Book, Scroll, Sun, Moon, Calendar, 
  Calculator, History, Users, User, TreePine, FlaskConical,
  Star, Settings, Search, LayoutDashboard
} from 'lucide-react';

import { QuranHome } from '../quran/pages/QuranHome';
import { KnowledgeGateway } from '../../pages/KnowledgeGateway';

const modules: AppModule[] = [
  { id: 'dashboard', title: 'Dashboard', description: 'Knowledge Gateway', icon: LayoutDashboard, route: '/', status: 'Production Ready', category: 'Core', order: 0, enabled: true, component: KnowledgeGateway },
  { id: 'quran', title: 'Quran', description: 'The Divine Revelation', icon: BookOpen, route: '/quran', status: 'Foundation Complete', category: 'Revelation', order: 1, enabled: true, component: QuranHome },
  { id: 'hadith', title: 'Hadith', description: 'Prophetic Traditions', icon: Scroll, route: '/hadith', status: 'Planned', category: 'Revelation', order: 2, enabled: true },
  { id: 'tafsir', title: 'Tafsir', description: 'Exegesis & Interpretation', icon: Book, route: '/tafsir', status: 'Planned', category: 'Revelation', order: 3, enabled: true },
  { id: 'asma-ul-husna', title: 'Asma-ul-Husna', description: 'The Beautiful Names of Allah', icon: Sun, route: '/asma-ul-husna', status: 'Planned', category: 'Theology', order: 4, enabled: true },
  { id: 'prayer', title: 'Prayer', description: 'Salah timings and rulings', icon: Moon, route: '/prayer', status: 'Planned', category: 'Fiqh', order: 5, enabled: true },
  { id: 'calendar', title: 'Calendar', description: 'Hijri Calendar & Events', icon: Calendar, route: '/calendar', status: 'Planned', category: 'Tools', order: 6, enabled: true },
  { id: 'zakat', title: 'Zakat', description: 'Zakat Calculator & Rules', icon: Calculator, route: '/zakat', status: 'Planned', category: 'Fiqh', order: 7, enabled: true },
  { id: 'mirath', title: 'Mirath', description: 'Islamic Inheritance', icon: Calculator, route: '/mirath', status: 'Planned', category: 'Fiqh', order: 8, enabled: true },
  { id: 'history', title: 'History', description: 'Islamic History & Seerah', icon: History, route: '/history', status: 'Planned', category: 'History', order: 9, enabled: true },
  { id: 'prophets', title: 'Prophets', description: 'Stories of the Prophets', icon: Users, route: '/prophets', status: 'Planned', category: 'History', order: 10, enabled: true },
  { id: 'companions', title: 'Companions', description: 'The Sahabah', icon: Users, route: '/companions', status: 'Planned', category: 'History', order: 11, enabled: true },
  { id: 'scholars', title: 'Scholars', description: 'Biographies of Scholars', icon: User, route: '/scholars', status: 'Planned', category: 'History', order: 12, enabled: true },
  { id: 'nature', title: 'Nature', description: 'Flora & Fauna in Islam', icon: TreePine, route: '/nature', status: 'Planned', category: 'Science', order: 13, enabled: true },
  { id: 'science', title: 'Science', description: 'Scientific facts & history', icon: FlaskConical, route: '/science', status: 'Planned', category: 'Science', order: 14, enabled: true },
  { id: 'astronomy', title: 'Astronomy', description: 'Cosmology in Islam', icon: Star, route: '/astronomy', status: 'Planned', category: 'Science', order: 15, enabled: true },
  { id: 'glossary', title: 'Glossary', description: 'Islamic Terminology', icon: Book, route: '/glossary', status: 'Planned', category: 'Core', order: 16, enabled: true },
  { id: 'search', title: 'Search', description: 'Global Search', icon: Search, route: '/search', status: 'Planned', category: 'Core', order: 17, enabled: true },
  { id: 'settings', title: 'Settings', description: 'Platform Settings', icon: Settings, route: '/settings', status: 'Planned', category: 'Core', order: 18, enabled: true }
];

export class ModuleRegistry {
  static getModules(): AppModule[] {
    return modules.filter(m => m.enabled).sort((a, b) => a.order - b.order);
  }

  static getModule(id: string): AppModule | undefined {
    return modules.find(m => m.id === id && m.enabled);
  }

  static getModulesByCategory(): Record<string, AppModule[]> {
    const active = this.getModules();
    return active.reduce((acc, module) => {
      if (!acc[module.category]) acc[module.category] = [];
      acc[module.category].push(module);
      return acc;
    }, {} as Record<string, AppModule[]>);
  }
}
