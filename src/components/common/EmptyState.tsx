import * as React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon = <FolderOpen className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 p-12 text-center bg-white dark:border-zinc-800 dark:bg-zinc-950/20">
      {/* Icon Area */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800">
        {icon}
      </div>
      
      {/* Messages */}
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>

      {/* Primary Call to Action */}
      {actionText && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
