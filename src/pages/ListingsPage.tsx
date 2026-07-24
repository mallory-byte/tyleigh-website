import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyCard from '@/components/PropertyCard';
import { getProperties, GetPropertiesOutputType } from 'zite-endpoints-sdk';

type Property = GetPropertiesOutputType['properties'][0];

const states = ['All', 'Arizona', 'Arkansas', 'Colorado', 'Florida', 'Nevada', 'New Mexico'];

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const stateParam = searchParams.get('state') || 'All';

  const [selectedState, setSelectedState] = useState(stateParam);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'acres' | 'monthly'>('monthly');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties({}).then(data => {
      setProperties(data.properties);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const s = searchParams.get('state') || 'All';
    setSelectedState(s);
  }, [searchParams]);

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    if (state === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ state });
    }
  };

  const filtered = useMemo(() => {
    let list = [...properties];
    if (selectedState !== 'All') list = list.filter(p => p.state === selectedState);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === 'price') return a.cashPrice - b.cashPrice;
      if (sortBy === 'acres') return b.acres - a.acres;
      return a.monthlyPayment - b.monthlyPayment;
    });
    return list;
  }, [properties, selectedState, search, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Available Now</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {selectedState === 'All' ? 'All Available Properties' : `Properties in ${selectedState}`}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Owner-financed land across the US. No credit check. New listings added weekly.
          </p>
        </div>

        {/* Search & sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by state, county, or title..."
              className="pl-10 rounded-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort:</span>
            {(['monthly', 'price', 'acres'] as const).map(s => (
              <Button
                key={s}
                size="sm"
                variant={sortBy === s ? 'default' : 'outline'}
                onClick={() => setSortBy(s)}
                className="rounded-xl capitalize"
              >
                {s === 'monthly' ? 'Monthly $' : s === 'price' ? 'Cash Price' : 'Acres'}
              </Button>
            ))}
          </div>
        </div>

        {/* State filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {states.map(state => (
            <button
              key={state}
              onClick={() => handleStateSelect(state)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedState === state
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                <Skeleton className="w-full h-44" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing <strong>{filtered.length}</strong> propert{filtered.length !== 1 ? 'ies' : 'y'}
            </p>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-2xl mb-2">No properties found</p>
                <p className="text-sm">Try adjusting your filters or check back soon — new listings are added weekly!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((p, i) => (
                  <PropertyCard key={p.id} property={p} onClick={() => {}} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
