import { UniversalNode } from '../models/UniversalNode';
import { EvidenceRegistry } from './EvidenceRegistry';

export interface EvidenceValidationResult {
  readonly isValid: boolean;
  readonly checkedNodesCount: number;
  readonly errors: ReadonlyArray<string>;
  readonly warnings: ReadonlyArray<string>;
}

export class EvidenceValidator {
  private registry: EvidenceRegistry;

  constructor(registry = EvidenceRegistry.getInstance()) {
    this.registry = registry;
  }

  public validateNodes(nodes: ReadonlyArray<UniversalNode>): EvidenceValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const node of nodes) {
      if (!node.citations || node.citations.length === 0) {
        if (node.educationalLevel === 'Scholar' || node.category === 'QuranVerse' || node.category === 'Hadith') {
          warnings.push(`Missing Citation Warning: Primary node '${node.id}' has no evidentiary citations.`);
        }
      } else {
        for (const citation of node.citations) {
          if (!citation.code || citation.code.trim().length === 0) {
            errors.push(`Invalid Citation Error: Node '${node.id}' contains a citation with empty code string.`);
          }
        }
      }
    }

    // Verify immutability of all evidence records
    for (const record of this.registry.getAllEvidence()) {
      if (!Object.isFrozen(record)) {
        errors.push(`Immutability Error: Evidence record '${record.canonicalEvidenceId}' is not frozen.`);
      }
    }

    return Object.freeze({
      isValid: errors.length === 0,
      checkedNodesCount: nodes.length,
      errors: Object.freeze(errors),
      warnings: Object.freeze(warnings)
    });
  }
}
