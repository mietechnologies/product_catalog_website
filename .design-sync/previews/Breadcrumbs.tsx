import { Breadcrumbs } from 'mietech-catalog-ui';

export const Product = () => (
  <div className="p-4">
    <Breadcrumbs items={[{ label: 'Catalog', href: '/' }, { label: 'Dragon', href: '/?category=Dragon' }, { label: 'Ancient Red Dragon' }]} />
  </div>
);

export const Variant = () => (
  <div className="p-4">
    <Breadcrumbs items={[{ label: 'Catalog', href: '/' }, { label: 'Skeleton Warrior', href: '/item/skeleton-warrior' }, { label: 'Skeleton Warrior – Archer' }]} />
  </div>
);
