import { motion } from 'framer-motion';
import { Heart, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const values = [
  {
    icon: Heart,
    title: 'People First',
    description: 'We believe land ownership should be accessible to everyone — not just those with perfect credit or deep pockets. Our owner-financing model was built with families in mind.',
  },
  {
    icon: Shield,
    title: 'Transparent & Honest',
    description: 'No hidden fees. No tricks. What you see is what you get. We clearly outline all terms upfront so you can make an informed decision with confidence.',
  },
  {
    icon: Users,
    title: 'Community Focused',
    description: 'From Mississippi roots, we\'ve grown to help buyers across the country find their piece of land. Your success is our success.',
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Investment',
    description: 'Land appreciates over time. We help you start building wealth today — even on a modest budget — with flexible monthly payments that fit your life.',
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              About Ty-Leigh Capital
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              We're a family-owned land company dedicated to making land ownership affordable, simple, and accessible for everyday Americans.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="https://tyleighcapital.com/cdn/shop/files/HAT_SALE_2048_x_1152_px_2.png?v=1711382951"
                alt="Land landscape"
                className="rounded-2xl shadow-lg w-full object-cover aspect-video"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Our Mission</p>
              <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Land Ownership Made Easy
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Ty-Leigh Capital Land Co. was founded with one goal: to make land ownership possible for people who've been told "no" by traditional banks. We specialize in owner financing — meaning we act as the bank, so you never need a credit check or a large down payment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We source affordable vacant land across states like Colorado, Florida, Arizona, Arkansas, Nevada, and New Mexico — and offer flexible payment plans starting as low as $89/month. From the first call to receiving your deed, we walk with you every step of the way.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-5xl mb-4">🛡️</p>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            60-Day Money-Back Guarantee
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            We're so confident you'll love your land that we back every purchase with a 60-day money-back guarantee. If you're not completely satisfied, we'll refund every payment you've made — no questions asked.
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10"
            onClick={() => navigate('/listings')}
          >
            Browse Available Properties
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Start Your Land Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Call or text us at <a href="tel:6624424362" className="text-primary font-bold">(662) 442-4362</a> — we'd love to help you find the perfect property.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/listings')}>
              View Listings
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
