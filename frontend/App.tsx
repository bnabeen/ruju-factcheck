import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Language } from './types';

// Layout imports
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Page imports
import Home from './pages/Home';
import VerifyClaim from './pages/VerifyClaim';
import VerifyMedia from './pages/VerifyMedia';
import Feed from './pages/Feed';
import Article from './pages/Article';
import { About, Contact, SubmitClaim, Methodology, Team, Careers, Terms, Privacy, MediaLiteracy } from './pages/StaticPages';
import Donate from './pages/Donate';

// Admin Page imports
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ArticleManager from './pages/admin/ArticleManager';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
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
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes with nested Layout and Protection */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticleManager />} />
            <Route path="articles/new" element={<ArticleEditorPage />} />
            <Route path="articles/edit/:id" element={<ArticleEditorPage />} />
            <Route path="claims" element={<ClaimManager />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="careers" element={<CareerManager />} />
            <Route path="newsletter" element={<NewsletterManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="settings" element={<SiteSettingsManager />} />
            <Route path="content-ai" element={<ContentAI />} />
          </Route>

          {/* Public Routes (With Layout) */}
          <Route path="*" element={
            <Layout lang={lang} setLang={setLang}>
              <Routes>
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/verify" element={<VerifyClaim lang={lang} />} />
                <Route path="/media" element={<VerifyMedia lang={lang} />} />
                <Route path="/feed" element={<Feed lang={lang} />} />
                {/* Support both slug and old ID */}
                <Route path="/article/:slug" element={<Article lang={lang} />} />
                <Route path="/about" element={<About lang={lang} />} />
                <Route path="/methodology" element={<Methodology lang={lang} />} />
                <Route path="/team" element={<Team lang={lang} />} />
                <Route path="/careers" element={<Careers lang={lang} />} />
                <Route path="/terms" element={<Terms lang={lang} />} />
                <Route path="/privacy" element={<Privacy lang={lang} />} />
                <Route path="/resources" element={<MediaLiteracy lang={lang} />} />
                <Route path="/contact" element={<Contact lang={lang} />} />
                <Route path="/submit" element={<SubmitClaim lang={lang} />} />
                <Route path="/donate" element={<Donate lang={lang} />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;