import { motion } from 'framer-motion';
import { Search, FileCheck, CreditCard, Key } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Browse & Find',
    description: 'Explore our listings on the map or grid. Filter by state, price, or acreage to find your perfect land.',
  },
  {
    icon: FileCheck,
    number: '02',
    title: 'Reserve It',
    description: 'Call or text us at (662) 442-4362. No credit check required. We hold your property with a simple down payment.',
  },
  {
    icon: CreditCard,
    number: '03',
    title: 'Sign & Finance',
    description: 'Sign the land contract online. Choose owner financing starting as low as $89/month — no bank needed.',
  },
  {
    icon: Key,
    number: '04',
    title: 'Own Your Land',
    description: 'Once paid in full, we transfer the deed to your name. Start building your legacy from day one.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Simple Process</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            How It Works
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Own land in 4 easy steps — faster than you think.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-white/10" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <div className="absolute inset-2 rounded-full bg-accent/20" />
                <step.icon className="w-10 h-10 text-accent relative z-10" />
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                  {step.number.replace('0', '')}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Guarantee bar */}
        <div className="mt-16 bg-white/10 rounded-2xl p-6 md:p-8 text-center">
          <p className="text-2xl font-bold mb-2">🛡️ Our 60-Day Money-Back Guarantee</p>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            If you're not happy with your purchase for any reason within 60 days, we'll refund every payment you've made. No questions asked. That's our promise to you.
          </p>
        </div>
      </div>
    </section>
  );
}
