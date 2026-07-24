import { X, MapPin, Phone, Mail, CheckCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/data/properties';

type Props = {
  property: Property;
  onClose: () => void;
};

export default function PropertyModal({ property, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Image */}
        <div className="relative h-64">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-accent text-accent-foreground text-sm font-bold px-3 py-1.5 rounded-full">
              {property.acres} Acres
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-card-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{property.county} County, {property.state}</span>
          </div>

          <p className="text-muted-foreground mb-5 leading-relaxed">{property.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {property.features.map(f => (
              <Badge key={f} variant="secondary" className="text-sm">
                <CheckCircle className="w-3 h-3 mr-1" />{f}
              </Badge>
            ))}
          </div>

          {/* Pricing grid */}
          <div className="grid grid-cols-3 gap-4 bg-muted rounded-xl p-4 mb-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Cash Price</p>
              <p className="text-xl font-bold text-foreground">${property.cashPrice.toLocaleString()}</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-xs text-muted-foreground mb-1">Monthly</p>
              <p className="text-xl font-bold text-accent">${property.monthlyPayment}/mo</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Down Payment</p>
              <p className="text-xl font-bold text-foreground">${property.downPayment}</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground font-medium mb-1">✓ No Credit Check Required</p>
            <p className="text-sm text-foreground font-medium mb-1">✓ No Pre-Payment Penalty</p>
            <p className="text-sm text-foreground font-medium">✓ 60-Day Money-Back Guarantee</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-5 text-base font-semibold"
              asChild
            >
              <a href="tel:6624424362">
                <Phone className="w-4 h-4 mr-2" /> Call to Reserve
              </a>
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl py-5 text-base" asChild>
              <a href="mailto:info@tyleighcapital.com">
                <Mail className="w-4 h-4 mr-2" /> Send Inquiry
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
