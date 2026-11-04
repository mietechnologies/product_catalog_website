import { ProductCard } from 'mietech-catalog-ui';

const art = (bg: string, fg: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${bg}"/><circle cx="200" cy="170" r="80" fill="${fg}"/><rect x="130" y="230" width="140" height="110" rx="24" fill="${fg}"/></svg>`
  );

export const WithImage = () => (
  <div className="p-4" style={{ width: 280 }}>
    <ProductCard entry={{
      slug: 'ancient-red-dragon', name: 'Ancient Red Dragon', productCode: 'M-DR-0012', image: art('#fdf2e3', '#c96e04'),
      price: 24.5, productType: 'miniature', category: 'Dragon', collections: ['Core Set'], size: 'Gargantuan', creatureType: 'Dragon', hasVariants: false, type: 'product',
    }} />
  </div>
);

export const PriceRangeWithVariants = () => (
  <div className="p-4" style={{ width: 280 }}>
    <ProductCard entry={{
      slug: 'skeleton-warrior', name: 'Skeleton Warrior', productCode: 'M-UN-0004', image: art('#e6eef5', '#014878'),
      priceRange: { min: 6, max: 18 }, productType: 'miniature', category: 'Undead', collections: ['Halloween'], size: 'Medium', creatureType: 'Undead', hasVariants: true, type: 'item',
    }} />
  </div>
);

export const PlaceholderPrint = () => (
  <div className="p-4" style={{ width: 280 }}>
    <ProductCard entry={{
      slug: 'desk-organizer', name: 'Hex Desk Organizer', productCode: 'P-DO-0007', image: '',
      price: 12, productType: 'print', category: 'Desk & Office', collections: [], hasVariants: false, type: 'product',
    }} />
  </div>
);
