import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CheckCircle, Phone, Mail, Ruler, Building2, Route, Zap, Droplets, FlaskConical, Navigation, Shield, MountainSnow } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getProperties, GetPropertiesOutputType } from 'zite-endpoints-sdk';
import PaymentModal from '@/components/PaymentModal';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

type Property = GetPropertiesOutputType['properties'][0];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-border last:border-0">
      <span className="text-sm font-semibold text-foreground sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-muted-foreground leading-relaxed">{value}</span>
    </div>
  );
}



export default function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'finance' | 'cash'>('finance');
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

  useEffect(() => {
    const status = searchParams.get('payment');
    if (status === 'success') {
      toast.success('Payment received! We will send your land contract within 24 hours.');
    } else if (status === 'cancelled') {
      toast.info('Payment cancelled. Your property is still available — reserve anytime!');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;
    getProperties({}).then(data => {
      const found = data.properties.find(p => p.id === id);
      setProperty(found ?? null);
      setLoadingProperty(false);
    });
  }, [id]);

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full h-96 rounded-2xl" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div><Skeleton className="h-96 rounded-2xl" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground mb-3">Property Not Found</p>
          <Button onClick={() => navigate('/')}>Back to Listings</Button>
        </div>
      </div>
    );
  }

  const statusColor = {
    available: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-red-100 text-red-700',
  }[property.status];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Listings
        </button>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusColor} capitalize`}>
                  {property.status}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full font-semibold">
                {property.acres} Acres
              </div>
            </motion.div>

            {/* Title & location */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{property.county} County, {property.state}</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-xl font-bold text-foreground mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed text-base">{property.description}</p>
            </motion.div>

            {/* Property Information */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-foreground mb-4">Property Information</h2>
              <div className="bg-card border border-border rounded-2xl px-5 divide-y divide-border">
                <InfoRow label="Parcel Size" value={`${property.acres} Acres (${(property.acres * 43560).toLocaleString()} sq ft)`} />
                <InfoRow label="State" value={property.state} />
                <InfoRow label="County" value={`${property.county} County`} />
                {property.parcelId && <InfoRow label="Parcel Number" value={property.parcelId} />}
                {property.legalDescription && (
                  <InfoRow label="Legal Description" value={property.legalDescription} />
                )}
              </div>
            </motion.div>

            {/* Property Features */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="text-xl font-bold text-foreground mb-4">Property Features</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Ruler className="w-5 h-5 text-primary" />, label: 'Acres', value: `${property.acres} ac` },
                  { icon: <Building2 className="w-5 h-5 text-primary" />, label: 'County', value: `${property.county} Co.` },
                  { icon: <Route className="w-5 h-5 text-primary" />, label: 'Access', value: property.access || 'N/A' },
                  { icon: <Zap className="w-5 h-5 text-primary" />, label: 'Power', value: property.power || 'N/A' },
                  { icon: <Droplets className="w-5 h-5 text-primary" />, label: 'Water', value: property.water || 'N/A' },
                  { icon: <FlaskConical className="w-5 h-5 text-primary" />, label: 'Septic', value: property.septic || 'N/A' },
                  { icon: <Navigation className="w-5 h-5 text-primary" />, label: 'Coordinates', value: `${property.lat.toFixed(4)}°N ${Math.abs(property.lng).toFixed(4)}°W` },
                  { icon: <Shield className="w-5 h-5 text-primary" />, label: 'Zoning', value: property.zoning || 'N/A' },
                  { icon: <MountainSnow className="w-5 h-5 text-primary" />, label: 'Elevation', value: property.elevation || 'N/A' },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {icon}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium text-foreground leading-snug">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financing details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Financing Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center bg-card rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                    <p className="text-2xl font-bold text-accent">${property.monthlyPayment}</p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                  <div className="text-center bg-card rounded-xl p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Down Payment</p>
                    <p className="text-2xl font-bold text-foreground">${property.downPayment}</p>
                    <p className="text-xs text-muted-foreground">to get started</p>
                  </div>
                  <div className="text-center bg-card rounded-xl p-4 border border-border col-span-2 md:col-span-1">
                    <p className="text-xs text-muted-foreground mb-1">Cash Price</p>
                    <p className="text-2xl font-bold text-foreground">${property.cashPrice.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">paid in full</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> No credit check required</span>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> No pre-payment penalty</span>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> 60-day money-back guarantee</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right: Purchase panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-primary text-primary-foreground p-5">
                  <p className="text-sm opacity-70 mb-1">Reserve This Property</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>{property.title}</p>
                  <p className="text-sm opacity-70 mt-1">{property.acres} acres · {property.county} Co., {property.state}</p>
                </div>

                <div className="p-5">
                  {property.status === 'available' ? (
                    <>
                      <p className="text-sm font-semibold text-foreground mb-3">Choose Your Purchase Method</p>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <button
                          onClick={() => setPaymentType('finance')}
                          className={`rounded-xl p-4 border-2 text-center transition-all ${
                            paymentType === 'finance'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-bold text-foreground text-sm">Owner Finance</p>
                          <p className="text-accent font-bold text-xl mt-1">${property.monthlyPayment}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                          <p className="text-xs text-muted-foreground mt-0.5">${property.downPayment} down</p>
                        </button>
                        <button
                          onClick={() => setPaymentType('cash')}
                          className={`rounded-xl p-4 border-2 text-center transition-all ${
                            paymentType === 'cash'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-bold text-foreground text-sm">Cash Purchase</p>
                          <p className="text-foreground font-bold text-xl mt-1">${property.cashPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">paid in full</p>
                        </button>
                      </div>

                      <div className="bg-muted rounded-xl p-4 mb-5 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {paymentType === 'finance' ? 'Down payment' : 'Property price'}
                          </span>
                          <span className="font-semibold text-foreground">
                            ${paymentType === 'finance' ? property.downPayment.toLocaleString() : property.cashPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Document fee</span>
                          <span className="font-semibold text-foreground">$249</span>
                        </div>
                        <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                          <span className="text-foreground">Due Today</span>
                          <span className="text-accent">
                            ${paymentType === 'finance'
                              ? (property.downPayment + 249).toLocaleString()
                              : (property.cashPrice + 249).toLocaleString()}
                          </span>
                        </div>
                        {paymentType === 'finance' && (
                          <p className="text-xs text-muted-foreground pt-1">
                            Then ${property.monthlyPayment}/mo until paid in full
                          </p>
                        )}
                      </div>

                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-5 text-base font-bold mb-3"
                        onClick={() => setShowPayment(true)}
                      >
                        Pay $249 Document Fee & Reserve
                      </Button>

                      <p className="text-xs text-center text-muted-foreground mb-4">
                        🔒 Secure payment · 60-day money-back guarantee
                      </p>

                      <div className="border-t border-border pt-4 space-y-2">
                        <a
                          href="tel:6624424362"
                          className="flex items-center justify-center gap-2 w-full border border-border rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Phone className="w-4 h-4 text-accent" /> Call (662) 442-4362
                        </a>
                        <a
                          href="mailto:info@tyleighcapital.com"
                          className="flex items-center justify-center gap-2 w-full border border-border rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <Mail className="w-4 h-4 text-primary" /> Email Us
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-lg font-bold text-muted-foreground mb-2">
                        {property.status === 'sold' ? 'This property has been sold.' : 'This property is under contract.'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-5">Check back for similar properties, or contact us.</p>
                      <Button onClick={() => navigate('/')} className="w-full rounded-xl">
                        View Other Listings
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                <div className="bg-card rounded-xl p-3 border border-border">
                  <p className="text-lg mb-1">🛡️</p>
                  <p className="font-medium">60-Day Guarantee</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border">
                  <p className="text-lg mb-1">✅</p>
                  <p className="font-medium">No Credit Check</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border">
                  <p className="text-lg mb-1">🔒</p>
                  <p className="font-medium">Secure Process</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          property={property}
          paymentType={paymentType}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
