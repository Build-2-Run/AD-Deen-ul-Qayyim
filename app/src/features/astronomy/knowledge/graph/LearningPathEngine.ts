import { KnowledgeNode } from './models/KnowledgeNode';
import { RelationshipEngine } from './RelationshipEngine';

export type EducationalLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Scholar';

export interface PathStep {
  readonly stepNumber: number;
  readonly title: string;
  readonly arabicTitle: string;
  readonly conceptSummary: string;
  readonly nodeRef?: KnowledgeNode;
}

export interface LearningPath {
  readonly id: string;
  readonly topicTitle: string;
  readonly arabicTitle: string;
  readonly level: EducationalLevel;
  readonly description: string;
  readonly steps: ReadonlyArray<PathStep>;
}

export class LearningPathEngine {
  private relationshipEngine: RelationshipEngine;

  constructor(relationshipEngine?: RelationshipEngine) {
    this.relationshipEngine = relationshipEngine ?? new RelationshipEngine();
  }

  public generateLearningPath(topicKey: string, level: EducationalLevel = 'Beginner'): LearningPath {
    const graph = this.relationshipEngine.getGraph();
    const key = topicKey.toLowerCase().trim();

    if (key.includes('sun') || key.includes('shams') || key.includes('prayer')) {
      const sunNode = graph.getNode('node:sun');
      const fajrNode = graph.getNode('node:fajr-end');
      const quranNode = graph.getNode('node:quran:36:38');
      const scholarNode = graph.getNode('node:historical-al-biruni');

      return {
        id: `path-sun-${level.toLowerCase()}`,
        topicTitle: 'Solar Mechanics & Islamic Prayer Times',
        arabicTitle: 'الشمس وحساب مواقيت الصلاة',
        level,
        description: 'Progressive educational path connecting solar diurnal motion, shadow geometry, Fiqh prayer windows, and classical scholarship.',
        steps: [
          {
            stepNumber: 1,
            title: 'The Sun (Al-Shams)',
            arabicTitle: 'الشمس',
            conceptSummary: 'Understanding the sun as a primary celestial reference for diurnal timekeeping.',
            nodeRef: sunNode
          },
          {
            stepNumber: 2,
            title: 'Earth Diurnal Rotation',
            arabicTitle: 'دوران الأرض',
            conceptSummary: 'How 24-hour Earth rotation causes continuous solar altitude and hour angle changes.',
            nodeRef: graph.getNode('node:earth-rotation')
          },
          {
            stepNumber: 3,
            title: 'Solar Declination & Seasonal Variation',
            arabicTitle: 'الميل الشمسي والتغير الفصلي',
            conceptSummary: 'Seasonal shifts in solar declination delta affecting Fajr depression angles and Asr shadow multipliers.',
            nodeRef: undefined
          },
          {
            stepNumber: 4,
            title: 'Five Canonical Prayer Times',
            arabicTitle: 'الصلوات الخمس',
            conceptSummary: 'Precise astronomical definitions for Fajr, Dhuhr, Asr, Maghrib, and Isha.',
            nodeRef: fajrNode
          },
          {
            stepNumber: 5,
            title: 'Shadow Length Geometry (Asr Prayer)',
            arabicTitle: 'ظل كل شيء مثله (صلاة العصر)',
            conceptSummary: 'Fiqh rules for Asr when shadow equals object height (Hanafi 2x height).',
            nodeRef: undefined
          },
          {
            stepNumber: 6,
            title: 'Quranic References',
            arabicTitle: 'الآيات القرآنية',
            conceptSummary: 'Surah Ya-Sin 36:38 and Surah Al-Isra 17:78 text foundations.',
            nodeRef: quranNode
          },
          {
            stepNumber: 7,
            title: 'Hadith Canon Evidence',
            arabicTitle: 'الأحاديث النبوية',
            conceptSummary: 'Hadith Jibril defining prayer boundaries to the Prophet (ﷺ).',
            nodeRef: undefined
          },
          {
            stepNumber: 8,
            title: 'Classical Scholars (Al-Biruni & Ibn al-Shatir)',
            arabicTitle: 'علماء الفلك المسلمون',
            conceptSummary: '11th-century geodesic and astrolabe innovations by Al-Biruni.',
            nodeRef: scholarNode
          },
          {
            stepNumber: 9,
            title: 'Modern Astronomical Precision',
            arabicTitle: 'الحساب الفلكي الحديث',
            conceptSummary: 'Meeus algorithms, WGS84 geodesy, and high-latitude twilight adjustments.',
            nodeRef: undefined
          }
        ]
      };
    }

    // Default Moon & Hilal Path
    const moonNode = graph.getNode('node:moon');
    const ramadanNode = graph.getNode('node:ramadan');

    return {
      id: `path-moon-${level.toLowerCase()}`,
      topicTitle: 'Lunar Motion & The Hijri Calendar',
      arabicTitle: 'حركة القمر والتقويم الهجري',
      level,
      description: 'Progressive educational path connecting lunar orbital phases, crescent sighting (Hilal), Ramadan, and Fiqh criteria.',
      steps: [
        {
          stepNumber: 1,
          title: 'The Moon (Al-Qamar)',
          arabicTitle: 'القمر',
          conceptSummary: 'Understanding lunar motion relative to Sun and Earth.',
          nodeRef: moonNode
        },
        {
          stepNumber: 2,
          title: 'Lunar Phases (Manazil al-Qamar)',
          arabicTitle: 'منازل القمر',
          conceptSummary: '29.53 day synodic month and illumination phases.',
          nodeRef: graph.getNode('node:lunar-phase')
        },
        {
          stepNumber: 3,
          title: 'Crescent Visibility Criteria (Yallop & Odeh)',
          arabicTitle: 'معايير رؤية الهلال',
          conceptSummary: 'Astronomical crescent width, arc of vision, and Danjon limit.',
          nodeRef: undefined
        },
        {
          stepNumber: 4,
          title: 'The Hijri Calendar & Ramadan',
          arabicTitle: 'التقويم الهجري وشهر رمضان',
          conceptSummary: 'Defining the 9th lunar month for obligatory fasting.',
          nodeRef: ramadanNode
        }
      ]
    };
  }
}
