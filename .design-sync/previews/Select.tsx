import { Select } from 'mietech-catalog-ui';

const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'].map((s) => ({ value: s, label: s }));

export const WithPlaceholder = () => (
  <div className="p-4">
    <Select aria-label="Filter by size" placeholder="All Sizes" options={sizes} defaultValue="" />
  </div>
);

export const Selected = () => (
  <div className="p-4">
    <Select
      aria-label="Sort results"
      placeholder="Sort by..."
      defaultValue="price-low"
      options={[
        { value: 'name-asc', label: 'Name A–Z' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
      ]}
    />
  </div>
);

export const Disabled = () => (
  <div className="p-4">
    <Select aria-label="Filter by size" placeholder="All Sizes" options={sizes} disabled />
  </div>
);
