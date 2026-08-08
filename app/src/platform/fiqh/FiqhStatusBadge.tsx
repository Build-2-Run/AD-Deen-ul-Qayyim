import { Badge } from '../../design/components/Badge';
import { Icon } from '../../design/icons/Icon';
import { FiqhStatusId, fiqhStatus } from './verificationStatus';

interface FiqhStatusBadgeProps {
  status: FiqhStatusId;
  showLabel?: boolean;
  className?: string;
}

/**
 * Renders an ADQ verification status (✔ Consensus / ⚠ Scholarly Difference /
 * 📖 Local Authority / 🔍 Needs Review) as a design-system badge. Shared across
 * every fiqh surface.
 */
export function FiqhStatusBadge({ status, showLabel = true, className }: FiqhStatusBadgeProps) {
  const meta = fiqhStatus(status);
  return (
    <Badge
      variant={meta.badgeVariant}
      className={`inline-flex items-center gap-1 text-[10px] ${className || ''}`}
      title={meta.description}
    >
      <Icon name={meta.icon} size={11} />
      {showLabel && meta.label}
    </Badge>
  );
}
