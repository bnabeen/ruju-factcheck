import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VerifyClaim from './pages/VerifyClaim';
import VerifyMedia from './pages/VerifyMedia';
import Feed from './pages/Feed';
import Article from './pages/Article';
import { About, Contact, SubmitClaim, Methodology, Team, Careers, Terms } from './pages/StaticPages';
import Donate from './pages/Donate';
import { Language } from './types';

// Admin imports
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ArticleManager from './pages/admin/ArticleManager';
import ClaimManager from './pages/admin/ClaimManager';
import ContentManager from './pages/admin/ContentManager';
import CareerManager from './pages/admin/CareerManager';
import NewsletterManager from './pages/admin/NewsletterManager';
import UserManager from './pages/admin/UserManager';
import SiteSettingsManager from './pages/admin/SiteSettingsManager';
import ContentAI from './pages/admin/ContentAI';

const App: React.FC = () => {
  // Initialize language from localStorage or default to Nepali
  const [lang, setLangState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('ruju_language');
    if (savedLang === Language.EN || savedLang === Language.NP) {
      return savedLang as Language;
    }
    return Language.NP;
  });

  // Update localStorage and document language when state changes
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('ruju_language', newLang);
    document.documentElement.lang = newLang === Language.NP ? 'ne' : 'en';
  };

  // Ensure HTML lang attribute is correct on initial load
  useEffect(() => {
    document.documentElement.lang = lang === Language.NP ? 'ne' : 'en';
  }, [lang]);

  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes (No Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/articles" element={<ArticleManager />} />
        <Route path="/admin/claims" element={<ClaimManager />} />
        <Route path="/admin/content" element={<ContentManager />} />
        <Route path="/admin/careers" element={<CareerManager />} />
        <Route path="/admin/newsletter" element={<NewsletterManager />} />
        <Route path="/admin/users" element={<UserManager />} />
        <Route path="/admin/settings" element={<SiteSettingsManager />} />
        <Route path="/admin/content-ai" element={<ContentAI />} />

        {/* Public Routes (With Layout) */}
        <Route path="*" element={
          <Layout lang={lang} setLang={setLang}>
            <Routes>
              <Route path="/" element={<Home lang={lang} />} />
              <Route path="/verify" element={<VerifyClaim lang={lang} />} />
              <Route path="/media" element={<VerifyMedia lang={lang} />} />
              <Route path="/feed" element={<Feed lang={lang} />} />
              <Route path="/article/:id" element={<Article lang={lang} />} />
              <Route path="/about" element={<About lang={lang} />} />
              <Route path="/methodology" element={<Methodology lang={lang} />} />
              <Route path="/team" element={<Team lang={lang} />} />
              <Route path="/careers" element={<Careers lang={lang} />} />
              <Route path="/terms" element={<Terms lang={lang} />} />
              <Route path="/contact" element={<Contact lang={lang} />} />
              <Route path="/submit" element={<SubmitClaim lang={lang} />} />
              <Route path="/donate" element={<Donate lang={lang} />} />
              {/* Fallback placeholders for other links */}
              <Route path="/resources" element={<div className="p-20 text-center">Media Literacy Resources Coming Soon</div>} />
              <Route path="/privacy" element={<div className="p-20 text-center">Privacy Policy Placeholder</div>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;