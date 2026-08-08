import { KnowledgeDomainType } from '../models/UniversalNode';
import { UniversalEdge, UniversalRelationType } from '../models/UniversalEdge';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';

export interface RelationshipRuleContext {
  readonly nodeRegistry: CanonicalNodeRegistry;
}

/**
 * Represents a single reusable cross-domain relationship rule.
 */
export interface RelationshipRule {
  /**
   * Unique ID for the rule (e.g. "rule:hadith->quran-references", "rule:hadith->astronomy-governs")
   */
  readonly ruleId: string;

  /**
   * Human-readable rule title
   */
  readonly name: string;

  /**
   * Source domain filter (optional)
   */
  readonly sourceDomain?: KnowledgeDomainType;

  /**
   * Target domain filter (optional)
   */
  readonly targetDomain?: KnowledgeDomainType;

  /**
   * Canonical relation type created by this rule
   */
  readonly relationType: UniversalRelationType;

  /**
   * Evaluates the rule against the node registry and returns generated cross-domain edges.
   */
  evaluate(context: RelationshipRuleContext): ReadonlyArray<UniversalEdge>;
}
