import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    category: 'Purchasing & Financing',
    items: [
      {
        q: 'Do I need good credit to buy land from Ty-Leigh Capital?',
        a: 'No credit check is required — ever. We offer owner financing directly, so your credit score has zero impact on your ability to purchase land with us. All you need is a small down payment and the monthly payment.',
      },
      {
        q: 'What is the $249 document fee?',
        a: 'The $249 document fee covers the cost of preparing your land contract, deed, and all associated paperwork to transfer the property into your name. This fee is collected at the time of reservation to secure the property for you.',
      },
      {
        q: 'What is the difference between owner financing and cash purchase?',
        a: 'With owner financing, you pay a small down payment today plus a monthly payment until the land is paid off — no bank required. With a cash purchase, you pay the full price upfront in a single payment and receive your deed immediately.',
      },
      {
        q: 'Is there a pre-payment penalty if I pay off my land early?',
        a: 'Absolutely not. You can pay off your land at any time with no penalty. Many of our customers choose to pay extra each month or pay it off in a lump sum when they\'re ready.',
      },
      {
        q: 'How long are the financing terms?',
        a: 'Financing terms vary by property but typically range from 36 to 84 months. The monthly payment shown on each listing reflects the standard term for that property. Contact us if you\'d like to discuss a custom term.',
      },
    ],
  },
  {
    category: 'The Buying Process',
    items: [
      {
        q: 'How do I reserve a property?',
        a: 'Click "Pay $249 Document Fee & Reserve" on any available property listing, choose your purchase method (owner finance or cash), fill in your contact information, and complete the secure payment through Stripe. We\'ll reach out within 24 hours to finalize your contract.',
      },
      {
        q: 'What happens after I pay the document fee?',
        a: 'Our team will contact you within 24 hours to review your land contract, answer any questions, and walk you through the signing process. Once the contract is signed and your first payment is received, the property is officially yours.',
      },
      {
        q: 'When will I receive the deed to my land?',
        a: 'For cash purchases, the deed is transferred shortly after full payment is confirmed. For owner-financed purchases, the deed is transferred once the final payment is made and the land is paid off in full.',
      },
      {
        q: 'Can I visit the property before purchasing?',
        a: 'Yes! We encourage you to visit any property before buying. Each listing includes GPS coordinates so you can navigate directly to the parcel. Our land is sold as-is, and visiting in person is a great way to see the land for yourself.',
      },
    ],
  },
  {
    category: 'Property & Land Use',
    items: [
      {
        q: 'Can I build a home on the land?',
        a: 'It depends on the property\'s zoning and county regulations. Most of our rural parcels are zoned agricultural or rural residential, which may allow for manufactured homes, cabins, or site-built homes with the appropriate permits. Always check with the county for current building requirements.',
      },
      {
        q: 'Are there utilities available on the land?',
        a: 'Utility availability varies by property and is listed in each property\'s details under Power, Water, and Septic. Many of our rural parcels are off-grid, meaning you\'d need solar power, a well, and a septic system — which is a popular choice for self-sufficient, off-grid living.',
      },
      {
        q: 'Can I camp or stay on the land right away?',
        a: 'In most cases, yes — once you\'re under contract you can begin using the land. However, camping rules vary by county, so we recommend checking local ordinances. Contact us and we\'ll share what we know about each specific parcel.',
      },
      {
        q: 'Do the properties have clear title?',
        a: 'Yes. All of our properties are thoroughly researched to ensure clear, marketable title before we list them for sale. You will receive a warranty deed or contract for deed upon purchase.',
      },
    ],
  },
  {
    category: 'Guarantees & Refunds',
    items: [
      {
        q: 'What is the 60-day money-back guarantee?',
        a: 'If for any reason you are not satisfied with your land purchase within 60 days, we will refund 100% of the payments you\'ve made — including the document fee. No questions asked. We stand behind every property we sell.',
      },
      {
        q: 'What if I want to cancel my financing after 60 days?',
        a: 'After the 60-day guarantee period, you may still cancel your contract. In that case, any payments made beyond the document fee are forfeited and the property reverts back to us. Please contact us as soon as possible if you\'re having trouble making payments.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full text-left flex items-start justify-between gap-4 py-5 group"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-muted-foreground leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Back */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/70 text-lg max-w-xl mx-auto"
          >
            Everything you need to know about buying land with Ty-Leigh Capital.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {faqs.map((section, i) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="mb-10"
          >
            <h2 className="text-lg font-bold text-foreground mb-1 px-1">{section.category}</h2>
            <div className="bg-card border border-border rounded-2xl px-5">
              {section.items.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </motion.div>
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center mt-4"
        >
          <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Still have questions?
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Our team is happy to help. Reach out and we'll get back to you quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:6624424362">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6">
                <Phone className="w-4 h-4 mr-2" /> Call (662) 442-4362
              </Button>
            </a>
            <a href="mailto:info@tyleighcapital.com">
              <Button variant="outline" className="rounded-xl px-6">
                <Mail className="w-4 h-4 mr-2" /> Email Us
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
