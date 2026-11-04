import { Gallery } from 'mietech-catalog-ui';

const art = (bg: string, fg: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="${bg}"/><circle cx="300" cy="250" r="120" fill="${fg}"/><rect x="190" y="350" width="220" height="170" rx="36" fill="${fg}"/></svg>`
  );

export const MultipleImages = () => (
  <div className="p-4" style={{ width: 400 }}>
    <Gallery name="Ancient Red Dragon" category="Dragon" images={[art('#fdf2e3', '#c96e04'), art('#e6eef5', '#014878'), art('#eef5e6', '#3a7a1f')]} />
  </div>
);

export const NoImages = () => (
  <div className="p-4" style={{ width: 400 }}>
    <Gallery name="Owlbear" category="Monstrosity" images={[]} />
  </div>
);
