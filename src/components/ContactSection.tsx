import { Phone, Mail, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { saveContactMessage } from 'zite-endpoints-sdk';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveContactMessage({ name, email, message });
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setName(''); setEmail(''); setMessage('');
    } catch {
      toast.error('Failed to send message. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Own Land?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We're here to help you find the perfect property and get you into owner financing today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <a href="tel:6624424362" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call or Text</p>
                  <p className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    (662) 442-4362
                  </p>
                </div>
              </a>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <a href="mailto:info@tyleighcapital.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Us</p>
                  <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    info@tyleighcapital.com
                  </p>
                </div>
              </a>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Business Hours</p>
                  <p className="font-semibold text-foreground">Mon–Fri: 9am–6pm CT</p>
                  <p className="text-sm text-muted-foreground">Sat: 10am–4pm CT</p>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <MessageSquare className="w-8 h-8 text-accent mb-3" />
              <p className="font-bold text-xl mb-2">Text us anytime!</p>
              <p className="text-primary-foreground/80 text-sm">
                Send a text to (662) 442-4362 with the property you're interested in and we'll get back to you fast.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name</label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                <Textarea
                  placeholder="I'm interested in property #... Tell us which listing you're inquiring about."
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  className="rounded-xl resize-none"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-5 text-base font-semibold">
                {loading ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
