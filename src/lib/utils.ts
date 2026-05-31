export function cn(...inputs: any[]) {
  return inputs
    .flat(Infinity)
    .filter((val) => typeof val === 'string' || typeof val === 'number' || (typeof val === 'object' && val !== null))
    .map((val) => {
      if (typeof val === 'object') {
        return Object.entries(val)
          .filter(([_, active]) => Boolean(active))
          .map(([className]) => className)
          .join(' ');
      }
      return String(val);
    })
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
}
