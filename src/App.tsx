import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ListingsSection from '@/components/ListingsSection';
import InteractiveMap from '@/components/InteractiveMap';
import HowItWorks from '@/components/HowItWorks';
import WhyUs from '@/components/WhyUs';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import PropertyPage from '@/pages/PropertyPage';
import FAQPage from '@/pages/FAQPage';
import AdminPage from '@/pages/AdminPage';
import PropertyFormPage from '@/pages/PropertyFormPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ListingsPage from '@/pages/ListingsPage';
import BuyingProcessPage from '@/pages/how-it-works/BuyingProcessPage';
import TitleEscrowPage from '@/pages/how-it-works/TitleEscrowPage';
import FinancingInfoPage from '@/pages/how-it-works/FinancingInfoPage';
import OurGuaranteePage from '@/pages/how-it-works/OurGuaranteePage';
import ReferralPage from '@/pages/how-it-works/ReferralPage';

function HomePage() {
  return (
    <main>
      <Hero />
      <ListingsSection />
      <InteractiveMap />
      <HowItWorks />
      <WhyUs />
      <ContactSection />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Toaster richColors position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/how-it-works/buying-process" element={<BuyingProcessPage />} />
          <Route path="/how-it-works/title-escrow" element={<TitleEscrowPage />} />
          <Route path="/how-it-works/financing-info" element={<FinancingInfoPage />} />
          <Route path="/how-it-works/our-guarantee" element={<OurGuaranteePage />} />
          <Route path="/how-it-works/referral" element={<ReferralPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/property/:id" element={<PropertyFormPage />} />
          <Route path="/admin/property/:id/edit" element={<PropertyFormPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
