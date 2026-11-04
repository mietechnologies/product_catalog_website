import { ProductGrid } from 'mietech-catalog-ui';

const mk = (i: number, name: string, category: string, price: number) => ({
  slug: `item-${i}`, name, productCode: `M-XX-00${i}`, image: '', price, productType: 'miniature' as const,
  category, collections: [], size: 'Medium' as const, creatureType: category, hasVariants: false, type: 'product' as const,
});
const entries = [
  mk(1, 'Ancient Red Dragon', 'Dragon', 24.5), mk(2, 'Skeleton Warrior', 'Undead', 6), mk(3, 'Owlbear', 'Monstrosity', 14),
  mk(4, 'Treant Elder', 'Plant', 18), mk(5, 'Fire Elemental', 'Elemental', 9), mk(6, 'Hill Giant', 'Giant', 21),
];

export const Results = () => (
  <div className="p-4" style={{ width: 600 }}>
    <ProductGrid entries={entries.slice(0, 4)} isLoading={false} />
  </div>
);

export const Loading = () => (
  <div className="p-4" style={{ width: 600, maxHeight: 420, overflow: 'hidden' }}>
    <ProductGrid entries={[]} isLoading />
  </div>
);

export const NoMatches = () => (
  <div className="p-4" style={{ width: 700 }}>
    <ProductGrid entries={[]} isLoading={false} hasActiveFilters onClearFilters={() => {}} />
  </div>
);

export const LoadError = () => (
  <div className="p-4" style={{ width: 700 }}>
    <ProductGrid entries={[]} isLoading={false} hasError onRetry={() => {}} />
  </div>
);

export const EmptyCatalog = () => (
  <div className="p-4" style={{ width: 700 }}>
    <ProductGrid entries={[]} isLoading={false} />
  </div>
);
