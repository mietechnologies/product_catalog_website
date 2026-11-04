import { PriceBlock } from 'mietech-catalog-ui';

export const Default = () => (
  <div className="p-4" style={{ width: 340 }}>
    <PriceBlock price={24.5} />
  </div>
);

export const WholeDollar = () => (
  <div className="p-4" style={{ width: 340 }}>
    <PriceBlock price={9} />
  </div>
);
