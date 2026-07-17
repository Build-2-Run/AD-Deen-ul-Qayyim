import { Typography } from '../../../components/ui/Typography';

export function NodeHeader({ title, arabic, translation }: { title: string, arabic?: string, translation?: string }) {
  return (
    <div className="mb-10 text-center md:text-left">
      <Typography variant="h1" className="text-tx-primary mb-4 text-4xl">{title}</Typography>
      {arabic && (
        <Typography variant="h2" className="text-tx-primary font-arabic text-3xl mb-4 leading-loose text-right md:text-left">
          {arabic}
        </Typography>
      )}
      {translation && (
        <Typography variant="body" className="text-tx-secondary text-lg leading-relaxed border-l-4 border-primary pl-4">
          {translation}
        </Typography>
      )}
    </div>
  );
}
