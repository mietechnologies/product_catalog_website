import { ProductTypeTabs } from 'mietech-catalog-ui';

export const AllSelected = () => (
  <div className="p-4" style={{ width: 420 }}>
    <ProductTypeTabs value={undefined} onChange={() => {}} />
  </div>
);

export const Miniatures = () => (
  <div className="p-4" style={{ width: 420 }}>
    <ProductTypeTabs value="miniature" onChange={() => {}} />
  </div>
);

export const Prints = () => (
  <div className="p-4" style={{ width: 420 }}>
    <ProductTypeTabs value="print" onChange={() => {}} />
  </div>
);
