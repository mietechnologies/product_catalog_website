import { SearchBar } from 'mietech-catalog-ui';

export const Empty = () => (
  <div className="p-4" style={{ width: 560 }}>
    <SearchBar value="" onChange={() => {}} />
  </div>
);

export const WithQuery = () => (
  <div className="p-4" style={{ width: 560 }}>
    <SearchBar value="owlbear" onChange={() => {}} />
  </div>
);

export const Loading = () => (
  <div className="p-4" style={{ width: 560 }}>
    <SearchBar value="owlbear" onChange={() => {}} isLoading />
  </div>
);
