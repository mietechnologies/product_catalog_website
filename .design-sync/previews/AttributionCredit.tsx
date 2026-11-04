import { AttributionCredit } from 'mietech-catalog-ui';

export const WithLink = () => (
  <div className="p-4" style={{ width: 360 }}>
    <AttributionCredit attribution={{ creator: 'Aria Voss', modelUrl: 'https://example.com/models/owlbear' }} />
  </div>
);

export const CreatorOnly = () => (
  <div className="p-4" style={{ width: 360 }}>
    <AttributionCredit attribution={{ creator: 'Aria Voss' }} />
  </div>
);
