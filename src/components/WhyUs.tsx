import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Zap, HeartHandshake, TrendingUp, MapPin } from 'lucide-react';

const reasons = [
  {
    icon: CreditCard,
    title: 'No Credit Check',
    desc: 'We never run a credit check. Anyone can qualify for owner financing with us.',
  },
  {
    icon: Zap,
    title: 'Fast Closing',
    desc: 'Close on your land in days — sometimes hours. No banks, no red tape.',
  },
  {
    icon: ShieldCheck,
    title: '60-Day Guarantee',
    desc: 'Full refund within 60 days if you change your mind. Zero risk.',
  },
  {
    icon: HeartHandshake,
    title: 'No Prepayment Penalty',
    desc: 'Pay off your land early anytime. No fees, no penalties, ever.',
  },
  {
    icon: TrendingUp,
    title: 'Appreciating Asset',
    desc: 'Land is a finite resource. Your investment grows as demand increases.',
  },
  {
    icon: MapPin,
    title: 'Multiple States',
    desc: 'Choose from Arizona, Arkansas, Colorado, Florida, Nevada & New Mexico.',
  },
];

export default function WhyUs() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop"
                alt="Beautiful land"
                className="w-full h-[450px] object-cover"
              />
            </div>
            {/* Stats badge */}
            <div className="absolute -bottom-6 -right-4 bg-card rounded-2xl shadow-xl p-5 border border-border">
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>200+</p>
                  <p className="text-xs text-muted-foreground">Properties Sold</p>
                </div>
                <div className="border-l border-border pl-6 text-center">
                  <p className="text-3xl font-bold text-accent" style={{ fontFamily: 'Playfair Display, serif' }}>6</p>
                  <p className="text-xs text-muted-foreground">States</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Why Ty-Leigh Capital</p>
            <h2 className="text-4xl font-bold text-foreground mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
              Land Ownership Made
              <br /><em>Accessible for Everyone</em>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              We believe everyone deserves the chance to own a piece of America. That's why we offer flexible owner financing with no credit checks — making it possible for anyone to start building their legacy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
