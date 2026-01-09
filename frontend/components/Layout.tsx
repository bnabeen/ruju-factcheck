import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Facebook, Twitter, Instagram, Youtube, Mail, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { api } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Layout: React.FC<LayoutProps> = ({ children, lang, setLang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRujuAIOpen, setIsRujuAIOpen] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubscribed, setFooterSubscribed] = useState(false);
  const t = TRANSLATIONS[lang];
  const location = useLocation();

  // Active: Red, Inactive: Black
  const isActive = (path: string) => location.pathname === path ? 'text-ruju-red font-bold' : 'text-black hover:text-ruju-red font-medium transition-colors';

  const toggleLang = () => {
    setLang(lang === Language.EN ? Language.NP : Language.EN);
  };

  const handleFooterSubscribe = async () => {
    if (!footerEmail) return;
    try {
      await api.subscribeNewsletter(footerEmail);
      setFooterSubscribed(true);
      setFooterEmail('');
    } catch (err) {
      console.error('Failed to subscribe (footer)', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      {/* Navbar - White Background, Black Text */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <img src="/logo.png" alt="RUJU Logo" className="h-10 w-10 rounded-full object-cover group-hover:scale-110 transition-transform" />
                <span className="font-bold text-2xl tracking-tight text-black">RUJU FactCheck</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isActive('/')}>{t.nav.home}</Link>

              {/* RujuAI Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1 ${isActive('/verify') || isActive('/media') ? 'text-ruju-red font-bold' : 'text-black hover:text-ruju-red font-medium transition-colors'}`}>
                  {t.nav.ruju_ai} <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-black/10 z-50 transform translate-y-2 group-hover:translate-y-0">
                  <Link to="/verify" className="block px-4 py-2 text-sm text-black hover:bg-red-50 hover:text-ruju-red">
                    {t.nav.verify}
                  </Link>
                  <Link to="/media" className="block px-4 py-2 text-sm text-black hover:bg-red-50 hover:text-ruju-red">
                    {t.nav.media}
                  </Link>
                </div>
              </div>

              <Link to="/feed" className={isActive('/feed')}>{t.nav.feed}</Link>
              <Link to="/about" className={isActive('/about')}>{t.nav.about}</Link>
              <Link to="/donate" className={isActive('/donate')}>{t.nav.donate}</Link>

              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black text-black text-sm font-bold hover:bg-black hover:text-white transition active:scale-95"
                title={lang === Language.EN ? "Switch to Nepali" : "Switch to English"}
              >
                <Globe className="h-4 w-4" />
                <span>{lang === Language.EN ? 'EN' : 'ने'}</span>
              </button>

              <Link to="/submit" className="bg-ruju-red text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-black transition shadow-lg transform hover:-translate-y-0.5">
                {t.nav.submit}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={toggleLang}
                className="flex items-center gap-1 px-2 py-1 rounded border border-black text-sm text-black font-bold"
              >
                {lang === Language.EN ? 'EN' : 'ने'}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black hover:text-ruju-red p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-black/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-black hover:bg-red-50 hover:text-ruju-red">{t.nav.home}</Link>

              {/* Mobile RujuAI Dropdown */}
              <div>
                <button
                  onClick={() => setIsRujuAIOpen(!isRujuAIOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-black hover:bg-red-50 hover:text-ruju-red"
                >
                  {t.nav.ruju_ai}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isRujuAIOpen ? 'rotate-180' : ''}`} />
                </button>
                {isRujuAIOpen && (
                  <div className="pl-6 space-y-1 bg-gray-50/50">
                    <Link to="/verify" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-black hover:text-ruju-red">{t.nav.verify}</Link>
                    <Link to="/media" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-black hover:text-ruju-red">{t.nav.media}</Link>
                  </div>
                )}
              </div>

              <Link to="/feed" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-black hover:bg-red-50 hover:text-ruju-red">{t.nav.feed}</Link>
              <Link to="/donate" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-black hover:bg-red-50 hover:text-ruju-red">{t.nav.donate}</Link>
              <div className="pt-2 mt-2 border-t border-black/10">
                <Link to="/submit" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-bold text-ruju-red">{t.nav.submit}</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-white">
        {children}
      </main>

      {/* Footer - White BG, Black Text, Red Top Border */}
      <footer className="bg-white text-black py-12 border-t-4 border-ruju-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="RUJU Logo" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-bold text-xl text-black">RUJU FactCheck</span>
            </div>
            <p className="text-sm text-black/70 mb-4">
              {t.footer.tagline} <br />{t.footer.registered}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/RUJUFactCheck" target="_blank" rel="noopener noreferrer" title="Facebook">
                <Facebook className="h-5 w-5 text-black hover:text-ruju-red cursor-pointer transition" />
              </a>
              <a href="https://x.com/RUJUFactCheck" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                <Twitter className="h-5 w-5 text-black hover:text-ruju-red cursor-pointer transition" />
              </a>
              <a href="https://instagram.com/ruju_factcheck" target="_blank" rel="noopener noreferrer" title="Instagram">
                <Instagram className="h-5 w-5 text-black hover:text-ruju-red cursor-pointer transition" />
              </a>
              <a href="https://youtube.com/@RUJUFactCheck" target="_blank" rel="noopener noreferrer" title="YouTube">
                <Youtube className="h-5 w-5 text-black hover:text-ruju-red cursor-pointer transition" />
              </a>
              <a href="https://www.tiktok.com/@ruju_factcheck" target="_blank" rel="noopener noreferrer" title="TikTok">
                <TikTokIcon className="h-5 w-5 text-black hover:text-ruju-red cursor-pointer transition" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-black font-bold mb-4 uppercase tracking-wider text-sm">{t.footer.platform}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/verify" className="text-black/70 hover:text-ruju-red">{t.nav.verify}</Link></li>
              <li><Link to="/media" className="text-black/70 hover:text-ruju-red">{t.nav.media}</Link></li>
              <li><Link to="/feed" className="text-black/70 hover:text-ruju-red">{t.nav.feed}</Link></li>
              <li><Link to="/submit" className="text-black/70 hover:text-ruju-red">{t.nav.submit}</Link></li>
              <li><Link to="/donate" className="text-black/70 hover:text-ruju-red">{t.nav.donate}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-black font-bold mb-4 uppercase tracking-wider text-sm">{t.footer.resources}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-black/70 hover:text-ruju-red">{t.nav.about}</Link></li>
              <li><Link to="/methodology" className="text-black/70 hover:text-ruju-red">{t.footer.methodology}</Link></li>
              <li><Link to="/team" className="text-black/70 hover:text-ruju-red">{t.footer.team}</Link></li>
              <li><Link to="/careers" className="text-black/70 hover:text-ruju-red">{t.footer.careers}</Link></li>
              <li><Link to="/resources" className="text-black/70 hover:text-ruju-red">{t.footer.media_literacy}</Link></li>
              <li><Link to="/terms" className="text-black/70 hover:text-ruju-red">{t.footer.terms}</Link></li>
              <li><Link to="/privacy" className="text-black/70 hover:text-ruju-red">{t.footer.privacy}</Link></li>
              <li><Link to="/contact" className="text-black/70 hover:text-ruju-red">{t.footer.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-black font-bold mb-4 uppercase tracking-wider text-sm">{t.footer.newsletter}</h3>
            <p className="text-xs text-black/70 mb-2">{t.footer.newsletter_desc}</p>
            <div className="flex border border-black rounded-md overflow-hidden">
              <input
                type="email"
                placeholder={t.footer.email_placeholder}
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="bg-white border-none text-sm text-black p-2 rounded-none w-full focus:ring-0 placeholder:text-black/40"
              />
              <button
                onClick={handleFooterSubscribe}
                className="bg-ruju-red text-white px-4 hover:bg-black transition"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
            {footerSubscribed && (
              <div className="text-xs text-green-600 mt-2 font-bold">Subscribed!</div>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-black/10 text-center text-xs text-black/50">
          &copy; {new Date().getFullYear()} {t.footer.rights} | Site by <a href="https://devataai.carrd.co/#start" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:text-ruju-red transition">Devata Tech</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;