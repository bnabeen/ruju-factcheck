import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import VerdictBadge from '../components/VerdictBadge';
import { Language, FactCheckArticle } from '../types';
import { api } from '../services/api';

interface FeedProps {
  lang: Language;
}

const Feed: React.FC<FeedProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].feed;
  const [articles, setArticles] = useState<FactCheckArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await api.getArticles(lang);
        setArticles(data);
      } catch (error) {
        console.error('Failed to load articles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [lang]);

  const categories = [
    { id: 'All', label: t.filter_all },
    { id: 'Politics', label: t.filter_politics },
    { id: 'Technology', label: t.filter_tech },
    { id: 'Economy', label: t.filter_economy },
    { id: 'Society', label: t.filter_society }
  ];

  const categoryMap: Record<string, string> = {
    'All': 'All',
    'Politics': lang === Language.NP ? 'राजनीति' : 'Politics',
    'Technology': lang === Language.NP ? 'प्रविधि' : 'Technology',
    'Economy': lang === Language.NP ? 'अर्थतन्त्र' : 'Economy',
    'Society': lang === Language.NP ? 'समाज' : 'Society'
  };

  const currentCategoryLabel = categoryMap[filter] || 'All';
  const filteredArticles = filter === 'All' ? articles : articles.filter(a => a.category === currentCategoryLabel);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold text-black">{t.title}</h1>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-black" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition whitespace-nowrap border ${filter === cat.id
                ? 'bg-ruju-red text-white border-ruju-red'
                : 'bg-white text-black border-black/20 hover:border-black'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-20 text-black/50">Loading articles...</div>
        ) : filteredArticles.map(article => (
          <Link to={`/article/${article.slug}`} key={article.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-black/10 hover:shadow-xl hover:border-black/30 transition group flex flex-col">
            <div className="relative h-56 bg-black/5 overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute top-3 right-3">
                <VerdictBadge verdict={article.verdict} />
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-white text-ruju-red text-xs font-bold uppercase rounded border border-ruju-red">{article.category}</span>
                <span className="text-xs text-black/50">{article.date}</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3 group-hover:text-ruju-red transition">{article.title}</h3>
              <div
                className="text-black/70 text-sm flex-grow line-clamp-3"
                dangerouslySetInnerHTML={{ __html: article.summary }}
              />
              <div className="mt-6 pt-4 border-t border-black/5 text-sm text-black/50">
                {t.checked_by} <span className="font-bold text-black">{article.author}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Feed;