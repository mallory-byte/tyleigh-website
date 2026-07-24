import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const guaranteePoints = [
  'Full refund of every payment made within 60 days',
  'No complicated forms or hoops to jump through',
  'No questions asked — just let us know',
  'Applies to all owner-financed properties',
  'Refund processed promptly upon request',
];

export default function OurGuaranteePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Our Promise</p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Our Guarantee
        </h1>
        <p className="text-primary-foreground/80 mt-4 text-lg max-w-xl mx-auto">
          We stand behind every property we sell — 100%.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-7xl mb-6">🛡️</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            60-Day Money-Back Guarantee
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            We're so confident you'll love your land that every purchase is backed by a full 60-day money-back guarantee. If you're not completely happy for any reason — we'll refund every single payment you've made.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 border-2 border-primary shadow-sm mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-bold text-foreground">What's Covered</h3>
          </div>
          <ul className="space-y-3">
            {guaranteePoints.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-foreground/80">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-muted/40 rounded-2xl p-6 mb-10"
        >
          <h3 className="font-bold text-foreground text-lg mb-3">How to Claim a Refund</h3>
          <p className="text-muted-foreground leading-relaxed">
            Simply call or text us at <a href="tel:6624424362" className="text-primary font-bold">(662) 442-4362</a> or email <a href="mailto:info@tyleighcapital.com" className="text-primary font-bold">info@tyleighcapital.com</a> within 60 days of your purchase date. We'll process your refund promptly. It's that easy.
          </p>
        </motion.div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Shop With Confidence</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            With our guarantee, there's nothing to lose. Browse our available properties today.
          </p>
          <Button size="lg" className="rounded-full px-10" onClick={() => navigate('/listings')}>
            Browse Properties
          </Button>
        </div>
      </div>
    </div>
  );
}
