import { CardSkeleton } from 'mietech-catalog-ui';

export const Single = () => (
  <div className="p-4" style={{ width: 260 }}>
    <CardSkeleton />
  </div>
);

export const Row = () => (
  <div className="p-4 grid grid-cols-2 gap-5" style={{ width: 540 }}>
    <CardSkeleton />
    <CardSkeleton />
  </div>
);
