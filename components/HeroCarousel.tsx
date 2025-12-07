import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Language, FactCheckArticle } from '../types';
import { TRANSLATIONS } from '../constants';
import VerdictBadge from './VerdictBadge';
import { api } from '../services/api';

interface HeroCarouselProps {
    lang: Language;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ lang }) => {
    const t = TRANSLATIONS[lang];
    const [articles, setArticles] = useState<FactCheckArticle[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await api.getArticles(lang, 5);
                setArticles(data);
            } catch (error) {
                console.error('Failed to load carousel articles', error);
            }
        };
        fetchArticles();
    }, [lang]);

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (articles.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % articles.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [articles.length]);

    const nextSlide = () => {
        if (articles.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % articles.length);
    };

    const prevSlide = () => {
        if (articles.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    };

    if (articles.length === 0) {
        return null; // Or a loading skeleton
    }

    return (
        <div className="mt-12 max-w-4xl mx-auto relative group">
            <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5 bg-white">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {articles.map((article) => (
                        <div key={article.id} className="w-full flex-shrink-0">
                            <Link to={`/article/${article.id}`} className="flex flex-col md:flex-row h-full md:h-48 group/card">
                                {/* Image Side */}
                                <div className="w-full md:w-1/3 relative overflow-hidden">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <VerdictBadge verdict={article.verdict} size="sm" />
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="w-full md:w-2/3 p-6 flex flex-col justify-center bg-white relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <span className="text-6xl font-bold font-serif text-ruju-red">"</span>
                                    </div>

                                    <span className="text-xs font-bold text-ruju-red uppercase tracking-wider mb-2">
                                        {lang === Language.EN ? 'Latest Fact Check' : 'नवीनतम तथ्य जाँच'}
                                    </span>

                                    <h3 className="text-lg md:text-xl font-bold text-black mb-2 line-clamp-2 group-hover/card:text-ruju-red transition-colors">
                                        {article.title}
                                    </h3>

                                    <p className="text-black/60 text-sm line-clamp-2 mb-3">
                                        {article.summary}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs text-black/40 font-medium">
                                        <span>{article.date}</span>
                                        <span>•</span>
                                        <span>{article.category}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-ruju-red hover:text-white z-10"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-ruju-red hover:text-white z-10"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {articles.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-ruju-red w-6' : 'bg-black/20 hover:bg-black/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
