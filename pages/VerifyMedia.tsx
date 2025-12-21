import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { verifyImage } from '../services/geminiService';
import { AIAnalysisResult, Language } from '../types';
import VerdictBadge from '../components/VerdictBadge';
import { TRANSLATIONS } from '../constants';

interface VerifyMediaProps {
  lang?: Language;
}

const VerifyMedia: React.FC<VerifyMediaProps> = ({ lang = Language.EN }) => {
  const t = TRANSLATIONS[lang].media;
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [context, setContext] = useState('');

  useEffect(() => {
    if (location.state && location.state.file) {
      processFile(location.state.file as File);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) return;
    setLoading(true);
    try {
      const base64Data = preview.split(',')[1];
      const data = await verifyImage(base64Data, context, lang);
      setResult(data);
    } catch (error) {
      console.error("Image analysis error:", error);
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 bg-white">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black">{t.title}</h1>
        <p className="text-black/70 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-black/10 p-6">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-ruju-red" /> {t.upload_title}
            </h3>

            <div className="border-2 border-dashed border-black/20 rounded-lg p-8 text-center hover:border-black/40 transition relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded shadow-sm" />
              ) : (
                <div className="flex flex-col items-center justify-center text-black/50">
                  <UploadCloud className="h-12 w-12 mb-2" />
                  <p className="text-sm font-bold">{t.drag_drop}</p>
                  <p className="text-xs mt-1">{t.supports}</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-black mb-1">{t.context_label}</label>
              <textarea
                className="w-full border border-black/20 rounded-md p-3 text-sm focus:border-black outline-none bg-white text-black placeholder:text-black/30"
                rows={3}
                placeholder={t.context_placeholder}
                value={context}
                onChange={(e) => setContext(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="w-full mt-4 bg-ruju-red text-white py-3 rounded-md font-bold hover:bg-black disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? t.btn_running : t.btn_run}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-xl shadow-lg border border-black/10 overflow-hidden">
              <div className="bg-white p-4 border-b border-black/10 flex justify-between items-center">
                <h3 className="font-bold text-black">{t.report_title}</h3>
                <VerdictBadge verdict={result.verdict} />
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-ruju-red uppercase tracking-wide mb-2">{t.summary}</h4>
                  <div className="text-black font-medium" dangerouslySetInnerHTML={{ __html: result.summary }} />
                </div>
                <div className="bg-white p-4 rounded-lg border border-black/10 mb-6">
                  <h4 className="text-sm font-bold text-black mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> {t.findings}
                  </h4>
                  <div
                    className="text-sm text-black whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: result.reasoning }}
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-white text-ruju-red rounded text-sm border border-ruju-red">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{t.note}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-white rounded-xl border border-black/10 border-dashed flex flex-col items-center justify-center text-black/30 p-8 text-center">
              <div className="p-4 rounded-full mb-4 border border-black/10">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-black">{t.ready_title}</h3>
              <p className="max-w-xs mt-2 text-black/50">{t.ready_desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyMedia;