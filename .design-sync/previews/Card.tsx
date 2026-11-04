import { Card } from 'mietech-catalog-ui';

export const Basic = () => (
  <div className="p-4" style={{ width: 320 }}>
    <Card>
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-sm text-gray-900">Shipping & handling</h3>
        <p className="text-sm text-neutral">Miniatures ship within 3–5 business days of ordering.</p>
      </div>
    </Card>
  </div>
);

export const AsArticle = () => (
  <div className="p-4" style={{ width: 320 }}>
    <Card as="article">
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-sm text-gray-900">Ancient Red Dragon</h3>
        <p className="text-xs text-neutral">Gargantuan · Dragon</p>
      </div>
    </Card>
  </div>
);
