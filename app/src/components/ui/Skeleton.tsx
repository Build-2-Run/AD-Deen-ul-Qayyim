

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-elevated/50 rounded-xl ${className}`}></div>
  );
}
