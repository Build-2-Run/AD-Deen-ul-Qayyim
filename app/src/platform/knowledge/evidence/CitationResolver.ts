import { UniversalCitation } from '../models/UniversalNode';
import { EvidenceRecord } from './EvidenceRecord';
import { EvidenceRegistry } from './EvidenceRegistry';

export class CitationResolver {
  private registry: EvidenceRegistry;

  constructor(registry = EvidenceRegistry.getInstance()) {
    this.registry = registry;
  }

  public resolveCitation(citation: UniversalCitation): EvidenceRecord | undefined {
    // 1. Direct match on code
    const all = this.registry.getAllEvidence();
    const directMatch = all.find(e => e.title.toLowerCase() === citation.code.toLowerCase() || e.canonicalEvidenceId.endsWith(citation.code.toLowerCase().replace(/[\s:]+/g, '-')));
    if (directMatch) return directMatch;

    return undefined;
  }

  public resolveByCode(code: string): EvidenceRecord | undefined {
    if (!code) return undefined;
    const all = this.registry.getAllEvidence();
    return all.find(e => e.title.toLowerCase() === code.toLowerCase() || e.canonicalEvidenceId.toLowerCase().includes(code.toLowerCase().replace(/[\s:]+/g, '-')));
  }
}
