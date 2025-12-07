import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { Copy, Loader2, FileText, Video, Image as ImageIcon } from 'lucide-react';

const ContentAI: React.FC = () => {
    const [claim, setClaim] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'article' | 'reel' | 'infographic'>('article');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!claim.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await api.generateContent(claim);
            setResult(data);
        } catch (err) {
            console.error('Generation failed', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate content. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black mb-2">Ruju Content AI</h1>
                    <p className="text-gray-600">Generate fact-check articles, reel scripts, and infographic text instantly.</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleGenerate} className="flex gap-4">
                        <input
                            type="text"
                            value={claim}
                            onChange={(e) => setClaim(e.target.value)}
                            placeholder="Enter the claim to fact-check (e.g., 'Nepal has the highest mountain in the world')"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-transparent outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-ruju-red text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab('article')}
                                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'article' ? 'text-ruju-red border-b-2 border-ruju-red bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <FileText size={20} /> Website Article
                            </button>
                            <button
                                onClick={() => setActiveTab('reel')}
                                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'reel' ? 'text-ruju-red border-b-2 border-ruju-red bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Video size={20} /> Reel Script
                            </button>
                            <button
                                onClick={() => setActiveTab('infographic')}
                                className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'infographic' ? 'text-ruju-red border-b-2 border-ruju-red bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <ImageIcon size={20} /> Infographic
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'article' && (
                                <div className="space-y-6">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => copyToClipboard(`
Claim: ${result.article.claim}
Verdict: ${result.article.verdict}

Evidence:
${result.article.evidence}

Result:
${result.article.result}
                                            `)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold"
                                        >
                                            <Copy size={16} /> Copy Full Article
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-500 uppercase text-xs mb-1">Claim</h3>
                                        <p className="text-lg font-medium">{result.article.claim}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-500 uppercase text-xs mb-1">Verdict</h3>
                                        <span className="inline-block px-3 py-1 bg-gray-100 rounded font-bold text-ruju-red">
                                            {result.article.verdict}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-500 uppercase text-xs mb-1">Evidence</h3>
                                        <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
                                            {result.article.evidence}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-500 uppercase text-xs mb-1">Result</h3>
                                        <p className="text-gray-800">{result.article.result}</p>
                                    </div>
                                    {result.article.sources && result.article.sources.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-gray-500 uppercase text-xs mb-1">Sources</h3>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {result.article.sources.map((source: string, index: number) => (
                                                    <li key={index}>
                                                        <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                            {source}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reel' && (
                                <div>
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={() => copyToClipboard(result.reelScript)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold"
                                        >
                                            <Copy size={16} /> Copy Script
                                        </button>
                                    </div>
                                    <div className="bg-gray-900 text-white p-6 rounded-lg font-mono whitespace-pre-wrap">
                                        {result.reelScript}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'infographic' && (
                                <div>
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={() => copyToClipboard(result.infographic)}
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold"
                                        >
                                            <Copy size={16} /> Copy Text
                                        </button>
                                    </div>
                                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg whitespace-pre-wrap text-lg font-medium text-gray-800">
                                        {result.infographic}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ContentAI;
