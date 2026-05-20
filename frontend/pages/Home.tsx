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
        // Fetch latest 4 articles for the featured + list layout
        const data = await api.getArticles(lang, 4);
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
            
            {/* AI Disclaimer */}
            <p className="text-sm text-black/50 text-center mt-4">
              AI can make mistakes. <Link to="/contact" className="underline hover:text-ruju-red transition-colors">Report us</Link> if mistake detected.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Fact Check - White */}
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
          {/* LEFT SIDE - Featured Fact Check */}
          {articles[0] && (
            <Link to={`/article/${articles[0].slug}`} className="md:col-span-2 group block bg-white rounded-2xl overflow-hidden border border-black hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="relative aspect-video md:aspect-auto md:flex-grow bg-black/5 border-b border-black overflow-hidden">
                <img src={articles[0].imageUrl} alt={articles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute top-4 right-4">
                  <VerdictBadge verdict={articles[0].verdict} size="md" />
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center bg-white shrink-0">
                <span className="inline-block border border-black rounded-full px-3 py-1 text-[10px] font-bold text-black uppercase tracking-wider mb-4 w-max">
                  Fact Check
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-black group-hover:text-ruju-red leading-snug transition mb-4 line-clamp-3">
                  {articles[0].title}
                </h3>
                <div
                  className="text-black/70 text-base line-clamp-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: articles[0].summary }}
                />
              </div>
            </Link>
          )}

          {/* RIGHT SIDE - Fact Check List */}
          {articles.length > 1 && (
            <div className="md:col-span-1 flex flex-col gap-4 h-full">
              {articles.slice(1, 4).map((article) => (
                <Link to={`/article/${article.slug}`} key={article.id} className="group block bg-white rounded-xl p-5 border border-black/10 hover:shadow-md hover:border-black/30 transition-all duration-300 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block border border-black/10 rounded-full px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                      Fact Check
                    </span>
                    <VerdictBadge verdict={article.verdict} size="sm" />
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="flex-grow">
                      <h4 className="text-sm md:text-base font-bold text-black group-hover:text-ruju-red line-clamp-2 leading-snug transition mb-1">
                        {article.title}
                      </h4>
                      <div
                        className="text-black/60 text-xs line-clamp-1 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.summary }}
                      />
                    </div>
                    <div className="text-black/30 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 shrink-0">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT SIDE - Featured Video */}
            <div className="md:col-span-2 group block bg-white rounded-2xl overflow-hidden border border-black hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="relative w-full aspect-video md:aspect-auto md:flex-grow bg-black/5 border-b border-black overflow-hidden">
                <iframe
                  src={videoUrls[0].url.replace('watch?v=', 'embed/')}
                  title="Latest Video Fact Check"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center bg-white shrink-0">
                <span className="inline-block border border-black rounded-full px-3 py-1 text-[10px] font-bold text-black uppercase tracking-wider mb-4 w-max">
                  Video Fact Check
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-black group-hover:text-ruju-red leading-snug transition mb-4 line-clamp-3">
                  Featured Video Analysis
                </h3>
                <p className="text-black/70 text-base line-clamp-2 leading-relaxed">
                  Watch our latest detailed video breakdown and forensic analysis from the RUJU editorial team.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - Video List */}
            {videoUrls.length > 1 && (
              <div className="md:col-span-1 flex flex-col gap-4 h-full">
                {videoUrls.slice(1, 4).map((v, idx) => (
                  <div key={v.id} className="group flex flex-col bg-white rounded-xl p-5 border border-black/10 hover:shadow-md hover:border-black/30 transition-all duration-300 flex-1 justify-center cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-block border border-black/10 rounded-full px-2 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                        Video Check
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <div className="flex-grow">
                        <h4 className="text-sm md:text-base font-bold text-black group-hover:text-ruju-red line-clamp-2 leading-snug transition mb-1">
                          Fact Check Analysis {idx + 1}
                        </h4>
                        <div className="text-black/60 text-xs line-clamp-1 leading-relaxed">
                          Click to watch the full video analysis
                        </div>
                      </div>
                      <div className="text-black/30 group-hover:text-black group-hover:translate-x-1 transition-all duration-300 shrink-0">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      {/* Support Us Section */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black rounded-[1.5rem] p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 overflow-hidden relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-ruju-red/20 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Left Side: Square Image Placeholder */}
          <div className="w-full md:w-1/3 shrink-0 flex justify-center z-10">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-2xl border border-white/40 shadow-2xl flex items-center justify-center backdrop-blur-sm transition-transform duration-500 hover:scale-105">
              <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                Illustration
              </span>
            </div>
          </div>
          
          {/* Right Side: Text & CTAs */}
          <div className="w-full md:w-2/3 flex flex-col text-center md:text-left z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2">
              Support Us
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 max-w-2xl font-light">
              Description Short... Your support helps us continue our mission to combat misinformation and bring verified facts to the public. Join our community of truth-seekers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Link to="/donate" className="px-6 py-2.5 bg-ruju-red hover:bg-red-700 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-lg shadow-ruju-red/30 hover:shadow-xl hover:shadow-ruju-red/40 hover:-translate-y-1 w-full sm:w-auto text-center">
                Donate
              </Link>
              <Link to="/membership" className="px-6 py-2.5 bg-transparent border border-white/30 hover:border-white hover:bg-white/10 text-white text-sm font-bold rounded-full transition-all duration-300 w-full sm:w-auto text-center hover:-translate-y-1">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;