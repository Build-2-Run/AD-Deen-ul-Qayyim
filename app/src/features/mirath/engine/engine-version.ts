export const MIRATH_ENGINE_VERSION = '1.0.0-alpha.5';
export const MIRATH_RULESET_VERSION = '2026.07';
export const MIRATH_DATASET_VERSION = 'v1';

export interface CalculationMetadata {
  calculationId: string; // e.g. MR-2026-XXXXX
  timestamp: string;
  engineVersion: string;
  ruleSetVersion: string;
  datasetVersion: string;
  ruleSetContext: string; // e.g., 'Jumhur'
  calculationChecksum?: string; // SHA256 or simple hash of inputs
}

export function generateCalculationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `MR-${year}-${random}`;
}

export function generateChecksum(input: any): string {
  // Simple deterministic hash for verification
  const str = JSON.stringify(input);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function createCalculationMetadata(ruleSetContext: string = 'Jumhur', inputState?: any): CalculationMetadata {
  return {
    calculationId: generateCalculationId(),
    timestamp: new Date().toISOString(),
    engineVersion: MIRATH_ENGINE_VERSION,
    ruleSetVersion: MIRATH_RULESET_VERSION,
    datasetVersion: MIRATH_DATASET_VERSION,
    ruleSetContext,
    calculationChecksum: inputState ? generateChecksum(inputState) : undefined
  };
}

/**
 * The Supported Scope defines exactly what scenarios this engine guarantees to handle correctly.
 * Anything outside this scope is unsupported.
 */
export const PHASE_5A_SUPPORTED_SCOPE = {
  description: 'Production Scope (Phase 5A)',
  supported: [
    'Sunni Fara\'id (Jumhur RuleSet)',
    'Individual inheritance',
    'Fixed shares (Furud)',
    'Asabah (bi nafsihi, bi ghayrihi, ma\'a ghayrihi)',
    'Hajb (Hirman and Nuqsan)',
    'Awl (up to classical maximums)',
    'Radd (with and without spouses)',
    'Umariyyatayn (Mother/Father/Spouse cases)',
    'Mushtarakah (Himariyyah)',
    'Akdariyyah'
  ],
  unsupported: [
    'International inheritance law',
    'Civil law overrides',
    'Wasiyyah disputes',
    'Judicial conflict resolution',
    'Multiple estates (Munaskha)',
    'Trusts (Waqf)',
    'Pregnancy (Hamal) - Placeholder only',
    'Missing person (Mafqud) - Placeholder only',
    'Intersex (Khuntha) - Placeholder only'
  ]
};
