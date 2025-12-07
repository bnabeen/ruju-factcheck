import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, ArrowRight, Link as LinkIcon, Camera, MessageSquarePlus } from 'lucide-react';
import { verifyTextClaim } from '../services/geminiService';
import { AIAnalysisResult, Language } from '../types';
import VerdictBadge from '../components/VerdictBadge';
import { TRANSLATIONS } from '../constants';

interface VerifyClaimProps {
  lang?: Language;
}

const VerifyClaim: React.FC<VerifyClaimProps> = ({ lang = Language.EN }) => {
  const t = TRANSLATIONS[lang].verify;
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleVerification(q);
    }
  }, []);

  const handleVerification = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await verifyTextClaim(text, lang);
      setResult(data);
    } catch (err) {
      // Show the actual error message for better debugging
      const errorMessage = err instanceof Error ? err.message : t.error;
      setError(errorMessage);
      console.error('Verification error:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(query);
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
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 bg-white">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black">{t.title}</h1>
        <p className="text-black/70 mt-2">{t.subtitle}</p>
      </div>

      {/* Search Bar - Aligned with Home Hero Style */}
      <div className="bg-white rounded-full shadow-xl max-w-3xl mx-auto relative z-20 mb-12 transform transition-all ring-1 ring-black/10 hover:ring-black/30 hover:shadow-2xl">
        <form onSubmit={handleSubmit} className="flex items-center p-2 w-full">
          <div className="pl-5 pr-3 text-black/40 flex-shrink-0">
            <Search className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="flex-grow py-4 bg-transparent text-lg text-black placeholder:text-black/30 focus:outline-none w-full min-w-0"
          />
          <div className="h-10 w-px bg-black/10 mx-3 flex-shrink-0 hidden sm:block"></div>
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
              className="p-3 text-black/50 hover:text-ruju-red hover:bg-red-50 rounded-full transition-all duration-200"
              title={lang === Language.EN ? "Upload Media" : "मिडिया अपलोड"}
            >
              <Camera className="h-6 w-6" />
            </button>
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-ruju-red hover:bg-black text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.btn_analyzing : t.btn_analyze} <ArrowRight className="h-5 w-5 hidden sm:inline" />
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-white border border-ruju-red p-4 mb-8 rounded text-ruju-red shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white rounded-xl shadow-md border border-black/10 overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-black/10 flex justify-between items-center">
              <span className="text-sm font-bold text-black uppercase tracking-wide">{t.result_title}</span>
              <span className="text-sm text-black/50">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <VerdictBadge verdict={result.verdict} size="lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">{t.claim_analysis}</h3>
                  <p className="text-black leading-relaxed">{result.summary}</p>
                </div>
              </div>

              {/* Confidence Meter - Black/Red */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-black">{t.confidence}</span>
                  <span className="font-bold text-black">{result.confidence}%</span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${result.confidence > 50 ? 'bg-black' : 'bg-ruju-red'}`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-black/10">
                <h4 className="font-bold text-black mb-2">{t.reasoning}</h4>
                <div className="prose max-w-none text-sm text-black whitespace-pre-wrap">
                  {result.reasoning}
                </div>
              </div>
            </div>
          </div>

          {result.sources && result.sources.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-black/10 p-6">
              <h3 className="text-lg font-bold text-black mb-4">{t.evidence}</h3>
              <div className="grid gap-3">
                {result.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 border border-transparent hover:border-black/10 transition group overflow-hidden max-w-full"
                  >
                    <div className="bg-black/5 p-2 rounded text-black flex-shrink-0">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    {/* Updated constraints: min-w-0 flex-1 to force shrinking */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-black truncate">{source.title}</p>
                      <p className="text-xs text-black/50 truncate block">{source.uri}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-black/30 group-hover:text-black flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4 pb-8 border-t border-black/5">
            <button
              onClick={() => navigate('/submit', { state: { claim: query } })}
              className="inline-flex items-center gap-2 text-black/60 text-sm hover:text-ruju-red font-medium transition group p-2 rounded-lg hover:bg-black/5"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span className="underline decoration-dashed underline-offset-4 group-hover:decoration-solid">{t.disagree}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyClaim;