import { Skeleton } from 'mietech-catalog-ui';

export const TextLines = () => (
  <div className="p-4 space-y-3" style={{ width: 280 }}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const ImageBlock = () => (
  <div className="p-4" style={{ width: 240 }}>
    <Skeleton className="aspect-square w-full" />
  </div>
);
