import { Language, VerdictType, FactCheckArticle } from '../types';
import { api } from '../services/api';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { ArrowLeft, Calendar, User, Quote, FileText, Share2, ArrowRight } from 'lucide-react';
import VerdictBadge from '../components/VerdictBadge';

interface ArticleProps {
  lang: Language;
}

const Article: React.FC<ArticleProps> = ({ lang }) => {
  const { slug } = useParams();
  const t = TRANSLATIONS[lang].article;
  const [article, setArticle] = useState<FactCheckArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<FactCheckArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getArticleById(slug, lang);
        setArticle(data);

        // Fetch related articles (just latest for now)
        const related = await api.getArticles(lang, 3);
        setRelatedArticles(related.filter(a => a.slug !== slug));
      } catch (error) {
        console.error('Failed to load article', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, lang]);

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to subscribe', error);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Loading article...</div>;
  if (!article) return <div className="text-center py-20 font-bold">Article not found</div>;

  // Strict Palette Banner
  const getBannerStyle = (v: VerdictType) => {
    // Simple Black/White/Red logic
    if (v === VerdictType.FALSE || v === VerdictType.MISLEADING) {
      return 'border-ruju-red bg-white text-ruju-red';
    }
    return 'border-black bg-white text-black';
  };

  // Helper for status text
  const statusText = article.verdict === VerdictType.TRUE ? t.status_accurate : t.status_inaccurate;

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 bg-white">
      <Helmet>
        <title>{article.title} | RUJU FactCheck</title>
        <meta name="description" content={stripHtml(article.summary)} />
        <link rel="canonical" href={window.location.origin + `/article/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={stripHtml(article.summary)} />
        <meta property="og:image" content={article.imageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Link to="/feed" className="inline-flex items-center text-black/60 hover:text-ruju-red mb-8 transition font-medium group">
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> {t.back}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-ruju-red text-white px-3 py-0.5 rounded text-xs font-bold uppercase">
                {article.category}
              </span>
              <span className="text-black/60 text-sm flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" /> {article.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-black font-medium border-b border-black/10 pb-6">
              <div className="bg-black/5 p-1.5 rounded-full">
                <User className="h-4 w-4 text-black" />
              </div>
              <span>Fact-checked by <span className="text-black font-bold">{article.author}</span></span>
            </div>
          </div>

          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-sm mb-8 border border-black/10">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>

          {/* Verdict Banner - Strict */}
          <div className={`rounded-xl p-6 md:p-8 mb-10 border-2 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm ${getBannerStyle(article.verdict)}`}>
            <div className="transform scale-125 origin-left md:origin-center">
              <VerdictBadge verdict={article.verdict} size="lg" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold uppercase tracking-wide mb-1 opacity-100">{t.verdict}: {article.verdict}</h3>
              <p className="font-medium opacity-90 leading-relaxed">
                {t.conclusion_text} <strong>{article.verdict.toLowerCase()}</strong>. {t.conclusion_advisory}
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-bold text-black/50 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Quote className="h-4 w-4 fill-current" /> {t.claim_title}
            </h3>
            <div className="bg-white border-l-4 border-black shadow-sm p-6 rounded-r-lg">
              <p className="text-xl md:text-2xl font-serif text-black italic leading-relaxed">"{article.title}"</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-black mb-12">
            <h3 className="text-2xl font-bold text-black flex items-center gap-2 border-b border-black/10 pb-2 mb-6">
              <FileText className="h-6 w-6" /> {t.facts_title}
            </h3>
            <div className="space-y-6 text-black leading-relaxed">
              {article.summary && (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.summary) }} />
              )}
              {article.content && (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-8">
            <div className="font-bold text-black text-lg">{t.share_title}</div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-black text-black font-bold hover:bg-black hover:text-white transition">
                <Share2 className="h-4 w-4" /> {t.share_btn}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <div className="bg-white rounded-xl p-6 border border-black/10 shadow-sm">
              <h3 className="font-bold text-black text-lg mb-5 pb-2 border-b border-black/10">Related Fact Checks</h3>
              <div className="flex flex-col gap-6">
                {relatedArticles.map(rel => (
                  <Link to={`/article/${rel.slug}`} key={rel.id} className="group block">
                    <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 shadow-sm border border-black/5">
                      <img src={rel.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={rel.title} />
                      <div className="absolute top-2 right-2">
                        <VerdictBadge verdict={rel.verdict} size="sm" />
                      </div>
                    </div>
                    <h4 className="font-bold text-black group-hover:text-ruju-red leading-snug mb-1">{rel.title}</h4>
                    <span className="text-xs text-black/50 font-medium">{rel.date}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-black/10">
                <Link to="/feed" className="inline-flex items-center gap-1 text-sm font-bold text-ruju-red hover:underline">
                  View All Checks <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="bg-black text-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
              <p className="text-white/70 text-sm mb-4">Get the latest truth delivered to your inbox.</p>
              <div className="flex gap-2">
                {subscribed ? (
                  <div className="text-white font-bold bg-green-600 px-4 py-2 rounded w-full text-center">Subscribed!</div>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded px-3 py-2 text-black text-sm bg-white border-none focus:ring-2 focus:ring-ruju-red outline-none placeholder:text-black/30"
                    />
                    <button onClick={handleSubscribe} className="bg-ruju-red px-3 py-2 rounded font-bold hover:bg-white hover:text-ruju-red transition">Go</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;