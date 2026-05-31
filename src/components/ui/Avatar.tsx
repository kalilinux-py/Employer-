import * as React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallbackText: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({ src, alt, fallbackText, size = 'md', className, ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  };

  const initials = fallbackText
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 font-semibold text-zinc-650 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-350 select-none justify-center items-center',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || fallbackText}
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="leading-none text-zinc-700 dark:text-zinc-200">{initials}</span>
      )}
    </div>
  );
}
