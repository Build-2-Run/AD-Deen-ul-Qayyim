import { IconButton } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { ServiceComponentProps } from '../types';
import { useLibrary } from '../hooks/useLibrary';
import { cn } from '../../../utils/cn';

export function BookmarkService({ node }: ServiceComponentProps) {
  const { isBookmarked, toggleBookmark } = useLibrary();
  const active = isBookmarked(node.id);

  return (
    <IconButton 
      variant="ghost" 
      title={active ? "Remove Bookmark" : "Add Bookmark"}
      onClick={() => toggleBookmark(node.id)}
      className={cn("transition-all duration-300", active && "text-[var(--primary)]")}
    >
      <Icon name="Bookmark" size={18} className={cn(active && "fill-[var(--primary)]")} />
    </IconButton>
  );
}
