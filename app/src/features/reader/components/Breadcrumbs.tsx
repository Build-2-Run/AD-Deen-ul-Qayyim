import { Typography } from '../../../components/ui/Typography';
import { BreadcrumbItem } from '../types/reader';

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-tx-secondary text-sm">↓</span>}
          <Typography variant="caption" className={`uppercase tracking-wider font-bold ${index === items.length - 1 ? 'text-primary' : 'text-tx-secondary cursor-pointer hover:text-primary transition-colors'}`}>
            {item.label}
          </Typography>
        </div>
      ))}
    </div>
  );
}
