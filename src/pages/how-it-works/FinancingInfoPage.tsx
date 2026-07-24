import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const pros = [
  'No credit check required — ever',
  'Low down payments starting at $249',
  'Monthly payments as low as $89/month',
  'No bank approval or waiting period',
  'Flexible terms to fit your budget',
  'Early payoff allowed at any time',
];

const traditional = [
  'Credit score of 680+ typically required',
  'Down payments of 20–30% common',
  'Bank approval can take weeks or months',
  'Closing costs add thousands to the price',
  'Strict income verification required',
  'Many vacant land loans simply aren\'t available',
];

export default function FinancingInfoPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">How It Works</p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Financing Info
        </h1>
        <p className="text-primary-foreground/80 mt-4 text-lg max-w-xl mx-auto">
          Owner financing — the simple, accessible way to own land.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              What Is Owner Financing?
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Owner financing (also called seller financing) means that instead of borrowing from a bank, you make monthly payments directly to us — the seller. We act as the lender, which means <strong>no bank approval, no credit check, and no waiting</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Once you complete all your payments, we transfer the deed to your name and you own the land free and clear. It's that simple.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-2xl p-6 border-2 border-primary"
          >
            <h3 className="font-bold text-foreground text-xl mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Ty-Leigh Owner Financing
            </h3>
            <ul className="space-y-3">
              {pros.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-muted/40 rounded-2xl p-6 border border-border"
          >
            <h3 className="font-bold text-foreground text-xl mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              Traditional Bank Financing
            </h3>
            <ul className="space-y-3">
              {traditional.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="bg-primary rounded-2xl p-8 text-primary-foreground text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-primary-foreground/80 mb-6">Browse our listings and call or text us at (662) 442-4362 to reserve your property today.</p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10"
            onClick={() => navigate('/listings')}
          >
            Browse Available Land
          </Button>
        </div>
      </div>
    </div>
  );
}
