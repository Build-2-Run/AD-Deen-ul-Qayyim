

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`w-16 h-1 bg-gradient-to-r from-primary to-transparent rounded ${className}`} />;
}
