import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProperties, GetPropertiesOutputType } from 'zite-endpoints-sdk';

type Property = GetPropertiesOutputType['properties'][0];
const states = ['Arizona', 'Arkansas', 'Colorado', 'Florida', 'Nevada', 'New Mexico'];

// SVG-based US map with interactive state markers
const STATE_POSITIONS: Record<string, { x: number; y: number }> = {
  Colorado: { x: 28, y: 38 },
  Florida: { x: 70, y: 72 },
  Arizona: { x: 16, y: 52 },
  Arkansas: { x: 57, y: 48 },
  Nevada: { x: 10, y: 38 },
  'New Mexico': { x: 22, y: 56 },
};

// Approximate US map SVG viewBox coords for each state dot
const STATE_SVG: Record<string, { cx: number; cy: number }> = {
  Nevada:      { cx: 108, cy: 230 },
  Arizona:     { cx: 148, cy: 290 },
  Colorado:    { cx: 258, cy: 220 },
  'New Mexico':{ cx: 220, cy: 298 },
  Arkansas:    { cx: 510, cy: 265 },
  Florida:     { cx: 590, cy: 365 },
};

export default function InteractiveMap() {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProperties({}).then(data => setProperties(data.properties));
  }, []);

  const activeProps = activeState
    ? properties.filter(p => p.state === activeState && p.status !== 'sold')
    : [];

  return (
    <section id="map" className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Explore Properties</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Properties Across the USA
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Click a state marker to see available properties. Owner financing on all listings.
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Map visualization */}
            <div className="flex-1 p-6 bg-gradient-to-br from-primary/5 to-primary/10 min-h-[400px] flex flex-col items-center justify-center">
              {/* Embedded Google Maps with their existing map */}
              <div className="w-full relative" style={{ paddingBottom: '60%' }}>
                <iframe
                  src="https://www.google.com/maps/d/u/0/embed?mid=1KY4PJ3Tql8nCFIpYV4R9fezp_0LTETc&ehbc=025460&noprof=1"
                  className="absolute inset-0 w-full h-full rounded-xl border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Ty-Leigh Capital Property Map"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                📍 Click pins on the map to see individual properties
              </p>
            </div>

            {/* State selector panel */}
            <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-border">
              <div className="p-5 border-b border-border">
                <h3 className="font-bold text-foreground mb-1">Browse by State</h3>
                <p className="text-xs text-muted-foreground">Select a state to see available listings</p>
              </div>
              <div className="divide-y divide-border">
                {states.map(state => {
                  const count = properties.filter(p => p.state === state && p.status === 'available').length;
                  return (
                    <button
                      key={state}
                      onClick={() => setActiveState(activeState === state ? null : state)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors ${
                        activeState === state
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className={`w-4 h-4 ${activeState === state ? 'text-accent' : 'text-accent'}`} />
                        <span className="font-medium text-sm">{state}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        activeState === state ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {count} available
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Properties for active state */}
          {activeState && (
            <div className="border-t border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground text-lg">
                  Available in {activeState} ({activeProps.length})
                </h3>
                <button onClick={() => setActiveState(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProps.map(p => (
                  <div
                    key={p.id}
                    className="flex gap-3 bg-muted rounded-xl p-3 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => navigate(`/property/${p.id}`)}
                  >
                    <img src={p.image} alt={p.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.acres} acres · {p.county} Co.</p>
                      <p className="text-accent font-bold text-sm mt-1">${p.monthlyPayment}/mo</p>
                      <p className="text-xs text-muted-foreground">Cash: ${p.cashPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              {activeProps.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No available properties in {activeState} right now.</p>
                  <p className="text-sm mt-1">Check back soon — new listings added weekly!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
