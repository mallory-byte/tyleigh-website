import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const listingsDropdown = [
  { label: 'All Land', href: '/listings' },
  { label: 'Arizona', href: '/listings?state=Arizona' },
  { label: 'Arkansas', href: '/listings?state=Arkansas' },
  { label: 'Colorado', href: '/listings?state=Colorado' },
  { label: 'Florida', href: '/listings?state=Florida' },
  { label: 'Nevada', href: '/listings?state=Nevada' },
  { label: 'New Mexico', href: '/listings?state=New+Mexico' },
];

const howItWorksDropdown = [
  { label: 'Buying Process', href: '/how-it-works/buying-process' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Title / Escrow', href: '/how-it-works/title-escrow' },
  { label: 'Financing Info', href: '/how-it-works/financing-info' },
  { label: 'Our Guarantee', href: '/how-it-works/our-guarantee' },
  { label: 'Referral Program', href: '/how-it-works/referral' },
];

function DropdownMenu({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 text-foreground/70 hover:text-foreground text-sm font-medium transition-colors py-2"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg py-2 min-w-48 z-50">
          {items.map(item => (
            <button
              key={item.href}
              onClick={() => { navigate(item.href); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileListings, setMobileListings] = useState(false);
  const [mobileHIW, setMobileHIW] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card">
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-sm py-1.5 text-center font-medium">
        📞 Call or Text: (662) 442-4362 &nbsp;|&nbsp; No Credit Check &nbsp;|&nbsp; 60-Day Money-Back Guarantee
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="https://tyleighcapital.com/cdn/shop/files/Ty-Leigh_Logo_Horizontal_3a69b52f-3b43-4873-8954-0c162d9ce6b1.png?v=1720196662"
              alt="Ty-Leigh Capital Land Co."
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/70 hover:text-foreground text-sm font-medium transition-colors">
              Home
            </Link>
            <DropdownMenu label="Listings" items={listingsDropdown} />
            <DropdownMenu label="How It Works" items={howItWorksDropdown} />
            <Link to="/about" className="text-foreground/70 hover:text-foreground text-sm font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground/70 hover:text-foreground text-sm font-medium transition-colors">
              Contact
            </Link>
            <Button size="sm" className="ml-2" onClick={() => navigate('/listings')}>
              Browse Properties
            </Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-t border-border max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link to="/" className="text-foreground/80 hover:text-foreground py-2.5 border-b border-border text-sm font-medium block">
              Home
            </Link>

            {/* Listings dropdown */}
            <div className="border-b border-border">
              <button
                className="w-full flex items-center justify-between text-foreground/80 hover:text-foreground py-2.5 text-sm font-medium"
                onClick={() => setMobileListings(!mobileListings)}
              >
                Listings
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileListings ? 'rotate-180' : ''}`} />
              </button>
              {mobileListings && (
                <div className="pl-4 pb-2 flex flex-col gap-1">
                  {listingsDropdown.map(item => (
                    <Link key={item.href} to={item.href} className="text-muted-foreground hover:text-foreground py-1.5 text-sm block">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* How It Works dropdown */}
            <div className="border-b border-border">
              <button
                className="w-full flex items-center justify-between text-foreground/80 hover:text-foreground py-2.5 text-sm font-medium"
                onClick={() => setMobileHIW(!mobileHIW)}
              >
                How It Works
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileHIW ? 'rotate-180' : ''}`} />
              </button>
              {mobileHIW && (
                <div className="pl-4 pb-2 flex flex-col gap-1">
                  {howItWorksDropdown.map(item => (
                    <Link key={item.href} to={item.href} className="text-muted-foreground hover:text-foreground py-1.5 text-sm block">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="text-foreground/80 hover:text-foreground py-2.5 border-b border-border text-sm font-medium block">
              About
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground py-2.5 border-b border-border text-sm font-medium block">
              Contact
            </Link>

            <a href="tel:6624424362" className="flex items-center gap-2 text-accent font-semibold mt-3 py-2">
              <Phone className="w-4 h-4" /> (662) 442-4362
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
