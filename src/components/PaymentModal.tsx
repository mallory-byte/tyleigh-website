import { useState } from 'react';
import { X, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createCheckoutSession, saveLead, GetPropertiesOutputType } from 'zite-endpoints-sdk';

type Property = GetPropertiesOutputType['properties'][0];

type Props = {
  property: Property;
  paymentType: 'finance' | 'cash';
  onClose: () => void;
};

type Step = 'review' | 'contact';

export default function PaymentModal({ property, paymentType, onClose }: Props) {
  const [step, setStep] = useState<Step>('review');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const docFee = 249;
  const dueToday = paymentType === 'finance'
    ? property.downPayment + docFee
    : property.cashPrice + docFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save lead to database first
      await saveLead({
        propertyId: property.id,
        fullName: name,
        email,
        phone,
        purchaseType: paymentType,
      });

      const { checkoutUrl } = await createCheckoutSession({
        propertyId: property.id,
        propertyTitle: property.title,
        paymentType,
        downPayment: property.downPayment,
        cashPrice: property.cashPrice,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error('Payment setup failed. Please try again or call us directly.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-5 flex items-start justify-between">
          <div>
            <p className="text-sm opacity-70">Reserve Property</p>
            <p className="font-bold text-lg">{property.title}</p>
            <p className="text-sm opacity-70">{paymentType === 'finance' ? 'Owner Financing' : 'Cash Purchase'}</p>
          </div>
          <button onClick={onClose} className="text-primary-foreground/60 hover:text-primary-foreground mt-1" disabled={loading}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex border-b border-border">
          {(['review', 'contact'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`flex-1 py-3 text-xs font-semibold text-center capitalize transition-colors ${
                step === s ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground'
              }`}
            >
              {i + 1}. {s === 'review' ? 'Review Order' : 'Your Details & Pay'}
            </div>
          ))}
        </div>

        <div className="p-6">
          {/* Step 1: Review */}
          {step === 'review' && (
            <div>
              <h3 className="font-bold text-foreground text-lg mb-4">Review Your Order</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium text-foreground text-right max-w-[60%]">{property.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Purchase Type</span>
                  <span className="font-medium text-foreground capitalize">
                    {paymentType === 'finance' ? 'Owner Financing' : 'Cash Purchase'}
                  </span>
                </div>
                {paymentType === 'finance' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Down Payment</span>
                      <span className="font-medium text-foreground">${property.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Payment (after today)</span>
                      <span className="font-medium text-accent">${property.monthlyPayment}/mo</span>
                    </div>
                  </>
                )}
                {paymentType === 'cash' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cash Price</span>
                    <span className="font-medium text-foreground">${property.cashPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Document Fee</span>
                  <span className="font-medium text-foreground">${docFee}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span className="text-foreground">Due Today</span>
                  <span className="text-accent text-xl">${dueToday.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-muted rounded-xl p-4 mb-6 text-sm text-muted-foreground">
                <CreditCard className="w-5 h-5 text-foreground flex-shrink-0" />
                <p>You'll be redirected to a secure Stripe checkout page to enter your card details.</p>
              </div>

              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-5 text-base font-bold"
                onClick={() => setStep('contact')}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Contact + Pay */}
          {step === 'contact' && (
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold text-foreground text-lg mb-1">Your Contact Information</h3>
              <p className="text-sm text-muted-foreground mb-5">We'll use this to send your land contract after payment.</p>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="rounded-xl"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="rounded-xl"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="rounded-xl"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Order summary mini */}
              <div className="bg-muted rounded-xl px-4 py-3 mb-5 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Due today</span>
                <span className="font-bold text-accent text-base">${dueToday.toLocaleString()}</span>
              </div>

              <p className="text-xs text-muted-foreground mb-4 text-center">
                🔒 Payments processed securely by Stripe. We never store your card details.
              </p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setStep('review')} disabled={loading}>
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-bold py-5"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing checkout…
                    </span>
                  ) : (
                    `Pay $${dueToday.toLocaleString()} Now →`
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
