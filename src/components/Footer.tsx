import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-accent w-6 h-6" />
              <div>
                <div className="font-bold text-xl" style={{ fontFamily: 'Playfair Display, serif' }}>Ty-Leigh Capital</div>
                <div className="text-primary-foreground/60 text-xs">Land Co.</div>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-5 max-w-sm">
              Affordable vacant land with owner financing across the United States. No credit check, no hassle — just land ownership made easy.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent transition-colors rounded-lg flex items-center justify-center">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-accent transition-colors rounded-lg flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">Quick Links</p>
            <ul className="space-y-2">
              {[
                ['#listings', 'Browse Listings'],
                ['#map', 'Property Map'],
                ['#how-it-works', 'How It Works'],
                ['#about', 'About Us'],
                ['#contact', 'Contact'],
              ].map(([href, label]) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">Contact</p>
            <ul className="space-y-3">
              <li>
                <a href="tel:6624424362" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  <Phone className="w-4 h-4" /> (662) 442-4362
                </a>
              </li>
              <li>
                <a href="mailto:info@tyleighcapital.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  <Mail className="w-4 h-4" /> info@tyleighcapital.com
                </a>
              </li>
            </ul>
            <div className="mt-6 bg-white/5 rounded-xl p-4">
              <p className="text-xs text-primary-foreground/60 leading-relaxed">
                Licensed Land Dealer. All properties sold as-is. Buyer responsible for due diligence. Financing subject to terms.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} Ty-Leigh Capital Land Co. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-primary-foreground/50">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
