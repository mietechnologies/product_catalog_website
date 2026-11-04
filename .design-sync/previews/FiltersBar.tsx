import { FiltersBar } from 'mietech-catalog-ui';

const collections = ['Halloween', 'Winter Collection', 'Core Set'];

export const Miniatures = () => (
  <div className="p-4" style={{ width: 860 }}>
    <FiltersBar
      filters={{ productType: 'miniature', category: 'Dragon', hasVariants: true, priceMin: 10, priceMax: 25, sort: 'price-low' }}
      onChange={() => {}}
      collections={collections}
    />
  </div>
);

export const Prints = () => (
  <div className="p-4" style={{ width: 860 }}>
    <FiltersBar filters={{ productType: 'print', category: 'Decor' }} onChange={() => {}} collections={collections} />
  </div>
);

export const NoTypeSelected = () => (
  <div className="p-4" style={{ width: 860 }}>
    <FiltersBar filters={{}} onChange={() => {}} />
  </div>
);
