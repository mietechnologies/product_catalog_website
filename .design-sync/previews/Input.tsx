import { Input } from 'mietech-catalog-ui';

export const Default = () => (
  <div className="p-4" style={{ width: 360 }}>
    <Input placeholder="Search by name, code, category, or collection..." />
  </div>
);

export const Filled = () => (
  <div className="p-4" style={{ width: 360 }}>
    <Input defaultValue="goblin" aria-label="Search" />
  </div>
);

export const Disabled = () => (
  <div className="p-4" style={{ width: 360 }}>
    <Input defaultValue="Locked while saving" disabled />
  </div>
);
