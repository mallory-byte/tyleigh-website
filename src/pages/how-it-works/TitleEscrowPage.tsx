import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const sections = [
  {
    heading: null,
    body: 'A title company is a neutral entity that verifies the legitimacy of a property title, ensuring it\'s free from any claims, liens, or back taxes. If any issues with the title are discovered, the title company works to resolve them.',
  },
  {
    heading: 'Key Difference Between Our Service and a Title Company\'s',
    body: 'Although we carry out similar title research and validations, we do not have an underwriter for insuring our properties, which can make our assurances less impactful to banks and lenders compared to those from a title company.',
  },
  {
    heading: 'Is Using a Title Company Mandatory?',
    body: 'No, you have the option to pay us directly via cashier\'s check, bank transfer, or wire transfer. We handle the preparation and recording of all transfer documents.',
  },
  {
    heading: 'The Process, Timing, and Costs of Title Company Transactions',
    body: 'The process begins post your non-refundable doc fee payment. Within 24 hours, we will email you a sale/purchase agreement. Once signed and submitted by you, the title company starts their work.\n\nTitle companies usually need 30 to 45 days to complete their work due to their extensive transaction lists.',
  },
  {
    heading: 'Expected Closing Costs',
    body: 'Closing costs often correlate with the property\'s purchase price or the value you\'re insuring it for. It generally ranges from $500–$2,000, varying with the title companies and states.',
  },
  {
    heading: 'When will I receive the deed?',
    body: 'The deed typically arrives with insurance documents a month later.\n\nPlease note that we have no control over how fast the title company delivers these documents. Any queries regarding this should be directed to the title company.',
  },
];

export default function TitleEscrowPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">How It Works</p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Title/Escrow
        </h1>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm"
            >
              {section.heading && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {section.heading}
                  </h2>
                </div>
              )}
              <div className="space-y-3">
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 bg-primary rounded-2xl p-8 text-primary-foreground text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-bold">Have Questions?</h3>
          </div>
          <p className="text-primary-foreground/80 mb-6">
            Call or text us and we'll walk you through the title process step by step.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate('/listings')}>
              View Listings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
