import { FiqhStatusId, mostUncertainStatus } from '../../../platform/fiqh/verificationStatus';
import { ZakatDueLine } from './types';

// Re-export the shared vocabulary so consumers of the Zakat engine can import
// it from one place.
export {
  FIQH_STATUS,
  fiqhStatus,
  mostUncertainStatus,
} from '../../../platform/fiqh/verificationStatus';
export type { FiqhStatusId, FiqhStatusMeta } from '../../../platform/fiqh/verificationStatus';

/** The overall standing of a result is that of its least-settled line. */
export function summariseStatus(lines: ZakatDueLine[]): FiqhStatusId {
  if (lines.length === 0) return 'consensus';
  return mostUncertainStatus(lines.map((l) => l.status));
}
