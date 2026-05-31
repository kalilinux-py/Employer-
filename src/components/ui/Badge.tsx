import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyle = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none';
  
  const variants = {
    default: 'border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80',
    secondary: 'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800/80',
    destructive: 'border-transparent bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 dark:border-red-900/30',
    outline: 'text-zinc-950 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800',
    success: 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400 dark:border-green-900/30',
    warning: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 dark:border-yellow-900/30',
  };

  return (
    <div className={cn(baseStyle, variants[variant], className)} {...props} />
  );
}
