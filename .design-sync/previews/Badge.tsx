import { Badge } from 'mietech-catalog-ui';

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2 p-4">
    <Badge>Dragon</Badge>
    <Badge variant="accent">Halloween</Badge>
    <Badge variant="outline">Large</Badge>
  </div>
);

export const Collections = () => (
  <div className="flex flex-wrap items-center gap-2 p-4">
    <Badge variant="outline">Gargantuan</Badge>
    <Badge variant="accent">Winter Collection</Badge>
    <Badge>Undead</Badge>
    <Badge variant="accent">3 variants</Badge>
  </div>
);
