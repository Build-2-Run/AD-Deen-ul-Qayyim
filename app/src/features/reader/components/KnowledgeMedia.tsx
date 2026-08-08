import { Caption } from '../../../design/typography/BasicText';

interface KnowledgeMediaProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'auto' | 'video' | 'square';
}

export function KnowledgeMedia({ src, alt, caption, aspectRatio = 'auto' }: KnowledgeMediaProps) {
  return (
    <figure className="my-8 flex flex-col gap-3">
      <div 
        className="w-full bg-[var(--surface-elevated)] rounded-xl overflow-hidden border border-[var(--border)]"
        style={{ aspectRatio: aspectRatio === 'video' ? '16/9' : aspectRatio === 'square' ? '1/1' : 'auto' }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="text-center">
          <Caption className="text-[var(--text-secondary)]">{caption}</Caption>
        </figcaption>
      )}
    </figure>
  );
}
