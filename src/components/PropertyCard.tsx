import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Property } from '@/data/properties';

type Props = {
  property: Property;
  onClick: () => void;
  index?: number;
};

export default function PropertyCard({ property, onClick, index = 0 }: Props) {
  const navigate = useNavigate();
  const statusColor = {
    available: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-700',
  }[property.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor} capitalize`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {property.acres} acres
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-card-foreground text-lg leading-tight pr-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {property.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{property.county} County, {property.state}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{property.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {property.features.slice(0, 3).map(f => (
            <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
          ))}
        </div>

        {/* Pricing */}
        <div className="border-t border-border pt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Owner Financing</p>
            <p className="text-2xl font-bold text-accent">
              ${property.monthlyPayment}<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="text-xs text-muted-foreground">Down: ${property.downPayment}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Cash Price</p>
            <p className="text-lg font-bold text-foreground">${property.cashPrice.toLocaleString()}</p>
          </div>
        </div>

        {property.status === 'available' && (
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl" onClick={() => navigate(`/property/${property.id}`)}>
            View Listing →
          </Button>
        )}
        {property.status === 'pending' && (
          <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl" disabled>
            Under Contract
          </Button>
        )}
        {property.status === 'sold' && (
          <Button className="w-full mt-4" variant="outline" disabled>
            Sold
          </Button>
        )}
      </div>
    </motion.div>
  );
}
