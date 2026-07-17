import { Typography } from '../ui/Typography';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-6 md:py-0 transition-colors">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
        <Typography variant="small" className="text-tx-secondary">
          &copy; {new Date().getFullYear()} AD-Deen ul-Qayyim. Open Source Islamic Knowledge.
        </Typography>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-tx-secondary hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-tx-secondary hover:text-primary transition-colors">GitHub</a>
          <span className="text-sm font-medium text-tx-secondary/50">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
