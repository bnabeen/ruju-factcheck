import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Users, Award, Camera } from 'lucide-react';
import { Language, FactCheckArticle } from '../types';
import { TRANSLATIONS } from '../constants';
import VerdictBadge from '../components/VerdictBadge';
import HeroCarousel from '../components/HeroCarousel';
import { api } from '../services/api';

interface VideoUrl {
  id: string;
  url: string;
  status?: number;
}

interface HomeProps {
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [articles, setArticles] = useState<FactCheckArticle[]>([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoUrls, setVideoUrls] = useState<VideoUrl[]>([]);

  useEffect(() => {
    const fetchVideoUrls = async () => {
      try {
        const data = await api.getVideoUrls();
        setVideoUrls(data);
      } catch (error) {
        console.error('Failed to fetch video URLs', error);
      }
    };
    fetchVideoUrls();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch latest 3 articles
        const data = await api.getArticles(lang, 3);
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles', error);
      }
    };
    fetchArticles();
  }, [lang]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/verify?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleMediaIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      navigate('/media', { state: { file } });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section - White Background, Black Text */}
      <section className="relative bg-white text-black overflow-hidden border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              {t.hero.title} <br />
              <span className="text-ruju-red">{t.hero.subtitle}</span>
            </h1>
            <p className="text-xl text-black/70 mb-12 leading-relaxed max-w-2xl mx-auto">
              {t.hero.desc}
            </p>

            {/* Search Bar - White with Black Shadow/Ring */}
            <div className="bg-white rounded-full shadow-xl max-w-3xl mx-auto relative z-20 transform transition-all ring-1 ring-black/10 hover:ring-black/30 hover:shadow-2xl">
              <form onSubmit={handleSearch} className="flex items-center p-2 w-full">
                <div className="pl-5 pr-3 text-black/40 flex-shrink-0">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.hero.search_placeholder}
                  className="flex-grow py-4 bg-transparent text-lg text-black placeholder:text-black/30 focus:outline-none w-full min-w-0"
                />
                <div className="h-10 w-px bg-black/10 mx-3 flex-shrink-0 hidden sm:block"></div>

                {/* Media Upload Section */}
                <div className="flex items-center mr-2 flex-shrink-0 relative group">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                  />
                  <button
                    type="button"
                    onClick={handleMediaIconClick}
                    className="p-3 text-black/50 hover:text-ruju-red hover:bg-red-50 rounded-full transition-all duration-200 group-hover:scale-105"
                    title={lang === Language.EN ? "Analyze Media" : "मिडिया विश्लेषण"}
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                  {/* Custom Tooltip */}
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg z-30">
                    {lang === Language.EN ? 'Analyze Media' : 'मिडिया विश्लेषण'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-ruju-red hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0 shadow-lg active:scale-95"
                >
                  {lang === Language.EN ? 'Verify' : 'जाँच'} <ArrowRight className="h-5 w-5 hidden sm:inline" />
                </button>
              </form>
            </div>

            {/* Latest Fact Checks Carousel */}
            <HeroCarousel lang={lang} />

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold">
              <span className="flex items-center gap-2 text-black/60"><Shield className="h-4 w-4 text-ruju-red" /> {t.hero.trust_ai}</span>
              <span className="flex items-center gap-2 text-black/60"><Users className="h-4 w-4 text-ruju-red" /> {t.hero.trust_human}</span>
              <span className="flex items-center gap-2 text-black/60"><Award className="h-4 w-4 text-ruju-red" /> {t.hero.trust_reg}</span>
            </div>
          </div>
        </div>
      </section>



      {/* Latest Feed - White */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-between items-end mb-10 border-b border-black/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-black">{t.home.latest_title}</h2>
            <p className="text-black/60 mt-2">{t.home.latest_desc}</p>
          </div>
          <Link to="/feed" className="text-ruju-red font-bold hover:text-black flex items-center gap-1 pb-1 transition">
            {t.home.view_all} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <Link to={`/article/${article.slug}`} key={article.id} className="group block bg-white rounded-xl overflow-hidden border border-black/10 hover:shadow-xl hover:border-black/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-52 bg-black/5 overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-3 right-3">
                  <VerdictBadge verdict={article.verdict} size="sm" />
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-ruju-red uppercase tracking-wider flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-ruju-red"></span>
                  {article.category}
                </span>
                <h3 className="text-lg font-bold text-black group-hover:text-ruju-red line-clamp-2 leading-snug transition">
                  {article.title}
                </h3>
                <div
                  className="mt-3 text-black/70 text-sm line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.summary }}
                />
                <div className="mt-5 pt-4 border-t border-black/5 text-xs text-black/50 flex justify-between items-center">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Video Fact Checks Section */}
      {videoUrls.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="flex justify-between items-end mb-10 border-b border-black/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-black">Video Fact Check</h2>
              <p className="text-black/60 mt-2">Recent verifications from our editorial team.</p>
            </div>
            <a 
              href="https://www.youtube.com/channel/UCEAYs8wXweK6bPlRN-J1Crg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ruju-red font-bold hover:text-black flex items-center gap-1 pb-1 transition"
            >
              View All <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Main Video */}
            <div className="flex-1 w-full">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={videoUrls[0].url.replace('watch?v=', 'embed/')}
                  title="Latest Video Fact Check"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                />
              </div>
            </div>
            {/* Side Videos */}
            {videoUrls.length > 1 && (
              <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-64 overflow-x-auto lg:overflow-x-visible">
                {videoUrls.slice(1).map((v, idx) => (
                  <div key={v.id} className="flex-shrink-0 lg:flex-shrink bg-white rounded-lg shadow-md border border-black/10 overflow-hidden hover:shadow-lg hover:border-ruju-red/30 transition-all duration-300 cursor-pointer group">
                    <div className="relative w-64 lg:w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={v.url.replace('watch?v=', 'embed/')}
                        title={`Side Video ${idx + 1}`}
                        frameBorder="0"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How it works - White */}
      <section className="bg-white text-black py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-black">{t.home.how_title}</h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">

            {/* Step 1 */}
            <div className="bg-white border border-black/10 p-8 rounded-2xl shadow-lg w-full max-w-sm flex-1 hover:border-ruju-red/30 transition duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-black/10 text-ruju-red">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">{t.home.step1_title}</h3>
              <p className="text-black/70 leading-relaxed text-sm">{t.home.step1_desc}</p>
            </div>

            <div className="hidden md:block text-black/20">
              <ArrowRight className="h-8 w-8" />
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-black/10 p-8 rounded-2xl shadow-lg w-full max-w-sm flex-1 hover:border-ruju-red/30 transition duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-black/10 text-ruju-red">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">{t.home.step2_title}</h3>
              <p className="text-black/70 leading-relaxed text-sm">{t.home.step2_desc}</p>
            </div>

            <div className="hidden md:block text-black/20">
              <ArrowRight className="h-8 w-8" />
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-black/10 p-8 rounded-2xl shadow-lg w-full max-w-sm flex-1 hover:border-ruju-red/30 transition duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-black/10 text-ruju-red">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">{t.home.step3_title}</h3>
              <p className="text-black/70 leading-relaxed text-sm">{t.home.step3_desc}</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;