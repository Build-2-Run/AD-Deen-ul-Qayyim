import React from 'react';
import { Typography } from './Typography';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 dark:text-gray-400">
    {icon && <div className="mb-4 opacity-75">{icon}</div>}
    <Typography variant="h3" className="mb-2 text-gray-900 dark:text-gray-100">{title}</Typography>
    <Typography variant="body" className="mb-6 max-w-md">{description}</Typography>
    {action && <div>{action}</div>}
  </div>
);
