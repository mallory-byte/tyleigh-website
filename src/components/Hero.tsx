import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const perks = [
  'No Credit Check Required',
  'Starting at $99/mo',
  '60-Day Money-Back Guarantee',
  'Owner Financing Available',
];

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&auto=format&fit=crop')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/75" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">
            Ty-Leigh Capital Land Co.
          </p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Own Land.
            <br />
            <em className="text-accent">Start Today.</em>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Affordable vacant land across the US with flexible owner financing. No credit check. No hassle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {perks.map(perk => (
            <div key={perk} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-accent" />
              {perk}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-xl"
            onClick={() => scrollTo('#listings')}
          >
            Browse Available Properties
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full"
            onClick={() => scrollTo('#map')}
          >
            View on Map
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button onClick={() => scrollTo('#listings')} className="text-white/60 hover:text-white transition-colors animate-bounce">
            <ArrowDown className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
