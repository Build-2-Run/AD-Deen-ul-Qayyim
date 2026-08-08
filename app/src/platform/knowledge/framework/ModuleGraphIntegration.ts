import { KnowledgeDomainType } from '../models/UniversalNode';
import { CanonicalNodeRegistry } from './CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from './CanonicalRelationshipRegistry';

/**
 * Universal Interface for all Feature Module Graph Integrations.
 * Every current and future ADQ module MUST implement this interface to register
 * its canonical nodes and relationships into the Knowledge Graph.
 */
export interface ModuleGraphIntegration {
  /**
   * Unique module identifier (e.g., "quran", "hadith", "astronomy", "mirath", "zakat")
   */
  getModuleId(): string;

  /**
   * Primary Knowledge Domain for this module
   */
  getDomain(): KnowledgeDomainType;

  /**
   * Priority integer defining deterministic registration order (lower runs earlier).
   * Range: 100 (Core Revelation) to 500+ (Presentation / Extension modules).
   */
  getPriority(): number;

  /**
   * Phase 1: Register all canonical nodes owned by this module.
   */
  registerNodes(registry: CanonicalNodeRegistry): Promise<void> | void;

  /**
   * Phase 2: Register all relationships/edges owned by this module.
   */
  registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> | void;
}
