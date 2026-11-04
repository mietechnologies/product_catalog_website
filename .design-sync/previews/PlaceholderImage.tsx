import { PlaceholderImage } from 'mietech-catalog-ui';

const Tile = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 140, height: 140 }} className="rounded-lg overflow-hidden">{children}</div>
);

export const Miniatures = () => (
  <div className="p-4 flex flex-wrap gap-4">
    {['Dragon', 'Beast', 'Undead', 'Celestial'].map((c) => (
      <Tile key={c}><PlaceholderImage name={`${c} miniature`} category={c} className="h-full w-full" /></Tile>
    ))}
  </div>
);

export const Prints = () => (
  <div className="p-4 flex flex-wrap gap-4">
    {['Decor', 'Toy', 'Kitchen', 'Jewelry'].map((c) => (
      <Tile key={c}><PlaceholderImage name={`${c} print`} category={c} className="h-full w-full" /></Tile>
    ))}
  </div>
);

export const Sizes = () => (
  <div className="p-4 flex flex-wrap items-end gap-4">
    {(['sm', 'md', 'lg'] as const).map((s) => (
      <div key={s} style={{ width: 140, height: 140 }} className="rounded-lg overflow-hidden">
        <PlaceholderImage name={`Dragon ${s}`} category="Dragon" size={s} className="h-full w-full" />
      </div>
    ))}
  </div>
);
