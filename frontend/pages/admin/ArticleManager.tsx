import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Globe, Clock, CheckCircle, AlertCircle, Save, X, ExternalLink, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Language } from '../../types';

const ArticleManager: React.FC = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [verdictFilter, setVerdictFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVerdict = verdictFilter === 'ALL' || article.verdict === verdictFilter;
        const matchesStatus = statusFilter === 'ALL' || article.status === statusFilter;
        return matchesSearch && matchesVerdict && matchesStatus;
    });


    // Load categories from localStorage on mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('article_categories');
        if (savedCategories) {
            try {
                setCategories(JSON.parse(savedCategories));
            } catch (e) {
                console.error('Failed to parse saved categories', e);
            }
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const data = await api.getArticles(Language.EN, 100);
            setArticles(data);

            // Extract unique categories from articles and merge with saved categories
            const articleCategories = [...new Set(data.map((a: any) => a.category).filter(Boolean))];
            const savedCategories = localStorage.getItem('article_categories');
            const existingCategories = savedCategories ? JSON.parse(savedCategories) : [];
            const allCategories = [...new Set([...existingCategories, ...articleCategories])];

            if (allCategories.length > 0) {
                setCategories(allCategories as string[]);
                localStorage.setItem('article_categories', JSON.stringify(allCategories));
            }
        } catch (error) {
            console.error('Failed to fetch articles', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (article: any) => {
        navigate(`/admin/articles/edit/${article.id}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            await api.deleteArticle(id);
            fetchArticles();
        } catch (error) {
            console.error('Failed to delete article', error);
            alert('Failed to delete article');
        }
    };


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'ARCHIVED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'TRUE': return 'bg-green-500 text-white';
            case 'FALSE': return 'bg-red-500 text-white';
            case 'MISLEADING': return 'bg-amber-500 text-white';
            case 'UNVERIFIED': return 'bg-gray-500 text-white';
            default: return 'bg-blue-500 text-white';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ruju-red"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Article Management</h1>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">Manage your fact-checking articles and verdicts.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/articles/new')}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-bold rounded-lg shadow-sm text-white bg-ruju-red hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ruju-red transition-all duration-200 uppercase tracking-wider min-h-[44px]"
                >
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    New Article
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ruju-blue/20 focus:border-ruju-blue outline-none transition-all text-sm sm:text-base min-h-[44px]"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Plus size={18} className="rotate-45" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={verdictFilter}
                        onChange={(e) => setVerdictFilter(e.target.value)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-ruju-blue/20 outline-none min-h-[44px]"
                    >
                        <option value="ALL">All Verdicts</option>
                        <option value="TRUE">True</option>
                        <option value="FALSE">False</option>
                        <option value="MISLEADING">Misleading</option>
                        <option value="UNVERIFIED">Unverified</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-ruju-blue/20 outline-none min-h-[44px]"
                    >
                        <option value="ALL">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
            </div>


            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle sm:px-0">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Article Info</th>
                                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Verdict</th>
                                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Date</th>
                                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredArticles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                                            <div className="flex items-center">
                                                {(article.image_url || article.imageUrl) && (
                                                    <img className="h-10 w-16 object-cover rounded mr-3 sm:mr-4 hidden sm:block" src={article.image_url || article.imageUrl} alt="" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-bold text-gray-900 line-clamp-1">{article.title}</div>
                                                    <div className="text-xs text-ruju-red font-mono truncate">{article.slug}</div>
                                                    <div className="sm:hidden mt-1 flex flex-wrap gap-2">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getVerdictColor(article.verdict)}`}>
                                                            {article.verdict}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusColor(article.status)}`}>
                                                            {article.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hidden sm:table-cell">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getVerdictColor(article.verdict)}`}>
                                                {article.verdict}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusColor(article.status)}`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hidden lg:table-cell">
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded font-medium">{article.category}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-sm text-gray-500 hidden xl:table-cell">
                                            {article.date ? new Date(article.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(article)}
                                                    className="inline-flex items-center justify-center p-2 border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all min-w-[44px] min-h-[44px]"
                                                    title="Edit Article"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="inline-flex items-center justify-center p-2 border border-red-100 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all min-w-[44px] min-h-[44px]"
                                                    title="Delete Article"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {articles.length === 0 && (
                    <div className="text-center py-20">
                        <Plus className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No articles</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleManager;
