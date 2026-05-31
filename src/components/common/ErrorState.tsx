import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'System Offline',
  message,
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200/50 p-8 text-center bg-red-50/10 dark:border-red-900/30 dark:bg-red-950/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-650 dark:bg-red-950 dark:text-red-400 border border-red-150/40 dark:border-red-900/20">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1.5 max-w-md text-xs text-red-700 dark:text-red-400">
        {message}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button onClick={onRetry} variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950">
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
