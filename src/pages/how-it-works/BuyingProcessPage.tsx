import { motion } from 'framer-motion';
import { FileText, CreditCard, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BuyingProcessPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">How It Works</p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Buying Process
        </h1>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-8"
        >
          <p className="text-muted-foreground leading-relaxed text-lg">
            If you're thinking about buying land from us, you have three options for property conveyance or sale. Here they are…
          </p>
        </motion.div>

        {/* Option I */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              I. Online Direct Close
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-5">
            We offer an "all-digital closing" or "on-website closing" process. This involves paying the total cost of the property using our secure online platform. After the transaction, we handle the drafting and registration of all necessary documents for transferring the property to you.
          </p>
          <h3 className="text-lg font-bold text-foreground mb-3">The Process</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Once your document fee payment for the property is processed, you'll promptly receive a receipt via email. Following this, we will send you an invoice for the full amount of the property and a fresh deed along with any additional documentation required by the county to transfer the property. You'll receive these documents for review in your email within 24 hours.
            <br /><br />
            After you've given us the go-ahead on the new deed, we will take it through signing, notarization, and then dispatch it to the County for recording. Once the County officially records the new deed, they will send it directly to you for safekeeping.
            <br /><br />
            On average, the entire process, from the initial transaction to you receiving a hard copy of the recorded deed, wraps up in roughly two weeks.
          </p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => window.open('https://drive.google.com/file/d/1w0BllTIajk1DRKbAErgFOJsqSln9_WEn/view', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Sample Cash Purchase Agreement
          </Button>
        </motion.div>

        {/* Option II */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              II. Owner Financing
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-5">
            Owner Financing is like making a payment plan for a property. You start with a smaller down payment instead of paying the whole price at once. Then, you pay small amounts every month until the property is fully paid off.
          </p>
          <h3 className="text-lg font-bold text-foreground mb-3">The Process</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Once you've completed the document fee and down payment transactions (if applicable), you'll get a confirmation email. Within 24 hours, we prepare 3 documents for you to sign electronically (Promissory Note, Land Sale Contract and Land Sale Agreement). These will be sent to you via SignNow.com. These documents prove to the county that you are in contract with us and making payments to own the land. Once all payments have been made, the property will be deeded over to you.
          </p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => window.open('https://drive.google.com/file/d/1lr3NO4L-UKKNI8m89nHUJDr-_TvLwWrW/view', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            View Sample Financing Agreement
          </Button>
        </motion.div>

        {/* Option III */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Playfair Display, serif' }}>
              III. Title/Escrow Company
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-5">
            As a buyer, you can opt to use a title company to reassure you of the legitimacy of the land title and to help you with complex paperwork. However, any costs associated with title company services are the buyer's sole responsibility.
          </p>
          <h3 className="text-lg font-bold text-foreground mb-3">The Process</h3>
          <p className="text-muted-foreground leading-relaxed">
            After making the doc fee payment, you'll receive an email confirming the transaction. We'll prepare a sales agreement within 24 hours, and once you sign it, we'll send it to a title company. They'll investigate the title history, and then request the remaining payment from you and a signed deed from us. Once we sign the deed, they'll record it under your name, finalize the property transfer, and release funds to us.
          </p>
        </motion.div>

        <div className="bg-primary rounded-2xl p-8 text-primary-foreground text-center">
          <p className="text-2xl font-bold mb-2">Ready to Own Land?</p>
          <p className="text-primary-foreground/80 mb-6">Browse available properties and start your land journey today.</p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10"
            onClick={() => navigate('/listings')}
          >
            Browse Available Properties
          </Button>
        </div>
      </div>
    </div>
  );
}
