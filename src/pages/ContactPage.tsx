import ContactSection from '@/components/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Page header */}
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">We're Here to Help</p>
        <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contact Us
        </h1>
        <p className="text-primary-foreground/80 mt-4 text-lg max-w-xl mx-auto">
          Have a question about a property or want to get started? Reach out — we respond fast.
        </p>
      </div>
      <ContactSection />
    </div>
  );
}
