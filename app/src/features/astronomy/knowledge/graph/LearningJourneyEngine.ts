import { UniversalNode, EducationalLevel, KnowledgeDomainType } from './models/UniversalNode';
import { UniversalRelationshipEngine } from './UniversalRelationshipEngine';

export interface JourneyStep {
  readonly stepNumber: number;
  readonly phase: string;              // e.g. "Qur'an Verse", "Meaning", "Hadith", "Fiqh", "Scientific Context"
  readonly title: string;
  readonly domain: KnowledgeDomainType;
  readonly summary: string;
  readonly nodeRef?: UniversalNode;
}

export interface LearningJourney {
  readonly journeyId: string;
  readonly title: string;
  readonly targetLevel: EducationalLevel;
  readonly disciplinesCovered: ReadonlyArray<KnowledgeDomainType>;
  readonly steps: ReadonlyArray<JourneyStep>;
}

export class LearningJourneyEngine {
  private relEngine: UniversalRelationshipEngine;

  constructor(relEngine?: UniversalRelationshipEngine) {
    this.relEngine = relEngine ?? new UniversalRelationshipEngine();
  }

  public generateJourney(topicQuery: string, level: EducationalLevel = 'Beginner'): LearningJourney {
    const graph = this.relEngine.getGraph();
    const q = topicQuery.toLowerCase().trim();

    const matchedNode = graph.getAllNodes().find(
      n => n.id.toLowerCase().includes(q) ||
           n.names.english.toLowerCase().includes(q) ||
           n.aliases.some(a => a.toLowerCase().includes(q))
    ) ?? graph.getAllNodes()[0];

    const connectedNodes = graph.getConnectedNodes(matchedNode.id);

    const steps: JourneyStep[] = [
      {
        stepNumber: 1,
        phase: 'Qur\'an Verse',
        title: matchedNode.names.english,
        domain: matchedNode.domain,
        summary: `Foundational Quranic revelation and textual context: ${matchedNode.description}`,
        nodeRef: matchedNode
      },
      {
        stepNumber: 2,
        phase: 'Meaning & Linguistic Context',
        title: `Linguistic Analysis: ${matchedNode.names.arabic}`,
        domain: 'Arabic',
        summary: 'Classical Arabic root word derivation and semantic nuance in classical lexicons.',
        nodeRef: undefined
      },
      {
        stepNumber: 3,
        phase: 'Hadith Evidence',
        title: 'Prophetic Sunnah Applications',
        domain: 'Hadith',
        summary: 'Authentic traditions from Sahih al-Bukhari and Sahih Muslim establishing practical practice.',
        nodeRef: connectedNodes[0] ?? undefined
      },
      {
        stepNumber: 4,
        phase: 'Fiqh Rulings',
        title: 'Jurisprudential Rulings & Consensus',
        domain: 'Fiqh',
        summary: 'Consensus of the 4 Madhhabs (Hanafi, Maliki, Shafi\'i, Hanbali) regarding application.',
        nodeRef: undefined
      },
      {
        stepNumber: 5,
        phase: 'Historical Context',
        title: 'Classical Islamic Heritage',
        domain: 'History',
        summary: 'Historical practice in Medina, Damascus, Baghdad, Cairo, and Andalusian civilization.',
        nodeRef: undefined
      },
      {
        stepNumber: 6,
        phase: 'Scientific Context',
        title: 'Empirical Natural Science',
        domain: 'Biology',
        summary: 'Modern scientific observations in biology, physics, chemistry, and environmental science.',
        nodeRef: connectedNodes[1] ?? undefined
      },
      {
        stepNumber: 7,
        phase: 'Modern Relevance',
        title: 'Contemporary Application',
        domain: 'Daily Life',
        summary: 'Applying these eternal spiritual and scientific principles in daily modern life.',
        nodeRef: undefined
      },
      {
        stepNumber: 8,
        phase: 'Further Reading & Scholarly Canon',
        title: 'Primary References & Treatises',
        domain: 'Scholars',
        summary: 'Classical treatises by Al-Ghazali, Ibn Kathir, Al-Biruni, and Al-Nawawi.',
        nodeRef: undefined
      },
      {
        stepNumber: 9,
        phase: 'Related Topics & Interconnected Knowledge',
        title: 'Next Topics in Knowledge Graph',
        domain: 'Civilization',
        summary: `Explore connected domains: ${Array.from(new Set(connectedNodes.map(n => n.domain))).join(', ')}.`,
        nodeRef: undefined
      }
    ];

    const disciplines = Array.from(new Set(steps.map(s => s.domain)));

    return {
      journeyId: `journey-${matchedNode.id}-${level.toLowerCase()}`,
      title: `Universal Learning Journey: ${matchedNode.names.english}`,
      targetLevel: level,
      disciplinesCovered: Object.freeze(disciplines),
      steps: Object.freeze(steps)
    };
  }
}
