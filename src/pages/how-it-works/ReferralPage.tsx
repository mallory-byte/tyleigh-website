import { motion } from 'framer-motion';
import { Gift, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: Users,
    title: 'Share with Friends & Family',
    description: 'Tell someone you know about Ty-Leigh Capital. Share our website, listings, or just talk about your experience.',
  },
  {
    icon: DollarSign,
    title: 'They Make a Purchase',
    description: 'When your referral purchases a property, make sure they mention your name or contact info at the time of purchase.',
  },
  {
    icon: Gift,
    title: 'You Earn a Reward',
    description: 'We\'ll send you a referral reward as a thank-you for spreading the word. It\'s our way of showing appreciation for your trust.',
  },
];

export default function ReferralPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Earn Rewards</p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Referral Program
        </h1>
        <p className="text-primary-foreground/80 mt-4 text-lg max-w-xl mx-auto">
          Love your land? Tell a friend — and earn rewards when they buy.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Share the Land Love
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            When you refer a friend or family member who purchases a property from us, we reward you for it. It's that simple.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-5 bg-card rounded-2xl p-6 border border-border shadow-sm"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <step.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Step {i + 1}</div>
                <h3 className="font-bold text-foreground text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary rounded-2xl p-8 text-primary-foreground text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Refer Someone?</h3>
          <p className="text-primary-foreground/80 mb-6">
            Call or text us at (662) 442-4362 to learn more about current referral rewards and program details.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8"
              onClick={() => navigate('/listings')}
            >
              Browse Properties
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
