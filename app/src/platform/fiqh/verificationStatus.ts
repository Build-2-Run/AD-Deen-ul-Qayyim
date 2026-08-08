/**
 * ADQ Verification Status — a project-wide vocabulary for the epistemic
 * standing of any ruling, value, or derived result. Wherever the schools may
 * differ, ADQ states *which* status applies instead of silently picking one.
 *
 * This is a shared primitive: Zakat, Mirath, Prayer, and every future fiqh
 * surface should classify their outputs with one of these statuses.
 */
export type FiqhStatusId =
  | 'consensus' // ✔ agreed across the major schools
  | 'scholarly-difference' // ⚠ multiple valid opinions exist
  | 'local-authority' // 📖 follows a relied-upon local/official authority
  | 'needs-review'; // 🔍 not yet verified by a qualified scholar

export interface FiqhStatusMeta {
  id: FiqhStatusId;
  label: string;
  emoji: string;
  /** lucide-react icon name, for use with the design-system <Icon />. */
  icon: string;
  /** Maps to the design-system <Badge variant>. */
  badgeVariant: 'success' | 'warning' | 'primary' | 'default' | 'error';
  description: string;
}

export const FIQH_STATUS: Record<FiqhStatusId, FiqhStatusMeta> = {
  consensus: {
    id: 'consensus',
    label: 'Consensus',
    emoji: '✔',
    icon: 'CheckCircle2',
    badgeVariant: 'success',
    description: 'Agreed upon across the major schools of jurisprudence.',
  },
  'scholarly-difference': {
    id: 'scholarly-difference',
    label: 'Scholarly Difference',
    emoji: '⚠',
    icon: 'GitFork',
    badgeVariant: 'warning',
    description: 'The recognised schools hold more than one valid opinion here.',
  },
  'local-authority': {
    id: 'local-authority',
    label: 'Local Authority',
    emoji: '📖',
    icon: 'Landmark',
    badgeVariant: 'primary',
    description: 'Follows the ruling of a relied-upon local or official authority.',
  },
  'needs-review': {
    id: 'needs-review',
    label: 'Needs Review',
    emoji: '🔍',
    icon: 'Search',
    badgeVariant: 'default',
    description: 'Not yet verified by a qualified scholar; flagged for review.',
  },
};

export const fiqhStatus = (id: FiqhStatusId): FiqhStatusMeta => FIQH_STATUS[id];

/** The "least settled" status wins when summarising a set of results. */
const SEVERITY: Record<FiqhStatusId, number> = {
  consensus: 0,
  'local-authority': 1,
  'scholarly-difference': 2,
  'needs-review': 3,
};

export function mostUncertainStatus(ids: FiqhStatusId[]): FiqhStatusId {
  return ids.reduce<FiqhStatusId>(
    (worst, id) => (SEVERITY[id] > SEVERITY[worst] ? id : worst),
    'consensus'
  );
}
