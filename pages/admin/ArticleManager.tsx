import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Globe, Clock, CheckCircle, AlertCircle, Save, X, ExternalLink, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { Language } from '../../types';
import BilingualEditor from '../../components/editor/BilingualEditor';

const ArticleManager: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [verdictFilter, setVerdictFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVerdict = verdictFilter === 'ALL' || article.verdict === verdictFilter;
        const matchesStatus = statusFilter === 'ALL' || article.status === statusFilter;
        return matchesSearch && matchesVerdict && matchesStatus;
    });

    const [formData, setFormData] = useState({
        title_en: '',
        title_np: '',
        summary_en: '',
        summary_np: '',
        content_en: '',
        content_np: '',
        verdict: 'TRUE',
        status: 'DRAFT',
        category: 'Politics',
        image_url: '',
        slug: '',
    });
    const [isAutoSlug, setIsAutoSlug] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('article_draft');
        if (savedData && !editingId) {
            try {
                setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));
            } catch (e) {
                console.error('Failed to load draft');
            }
        }
    }, [editingId]);

    useEffect(() => {
        if (isDirty && !editingId) {
            const timer = setTimeout(() => {
                localStorage.setItem('article_draft', JSON.stringify(formData));
                setLastSaved(new Date());
                setIsDirty(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [formData, isDirty, editingId]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const generateSlug = (title: string): string =>
        title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

    const handleFormChange = (updates: Partial<typeof formData>) => {
        setFormData(prev => {
            const next = { ...prev, ...updates };
            // Auto-generate slug if it's still in auto mode and title_en changed
            if (isAutoSlug && updates.title_en !== undefined) {
                next.slug = generateSlug(updates.title_en);
            }
            return next;
        });
        setIsDirty(true);
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log('Submitting article data:', formData);
        try {
            // Save category to localStorage if it's new
            if (formData.category && !categories.includes(formData.category)) {
                const updatedCategories = [...categories, formData.category];
                setCategories(updatedCategories);
                localStorage.setItem('article_categories', JSON.stringify(updatedCategories));
            }

            if (editingId) {
                const response = await api.updateArticle(editingId, formData);
                console.log('Update success:', response);
                alert('Article updated successfully!');
            } else {
                const response = await api.createArticle(formData);
                console.log('Create success:', response);
                alert('Article published successfully!');
            }
            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchArticles();
        } catch (error: any) {
            console.error('Failed to save article:', error);
            // Attempt to get a more detailed error message if available
            const errorMsg = error.message || 'An unexpected error occurred';
            alert(`Failed to save article: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (article: any) => {
        setFormData({
            title_en: article.title_en || '',
            title_np: article.title_np || '',
            summary_en: article.summary_en || '',
            summary_np: article.summary_np || '',
            content_en: article.content_en || '',
            content_np: article.content_np || '',
            verdict: article.verdict || 'TRUE',
            status: article.status || 'DRAFT',
            category: article.category || 'Politics',
            image_url: article.image_url || article.imageUrl || '',
            slug: article.slug || '',
        });
        setIsAutoSlug(false); // When editing existing article, don't auto-generate unless manually requested or empty
        setEditingId(article.id);
        setShowForm(true);
        setIsDirty(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const resetForm = () => {
        setFormData({
            title_en: '',
            title_np: '',
            summary_en: '',
            summary_np: '',
            content_en: '',
            content_np: '',
            verdict: 'TRUE',
            status: 'DRAFT',
            category: 'Politics',
            image_url: '',
            slug: '',
        });
        setIsAutoSlug(true);
        localStorage.removeItem('article_draft');
        setIsDirty(false);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Article Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your fact-checking articles and verdicts.</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-sm text-white bg-ruju-red hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ruju-red transition-all duration-200 uppercase tracking-wider"
                    >
                        <Plus className="mr-2 -ml-1 h-5 w-5" />
                        New Article
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ruju-blue/20 focus:border-ruju-blue outline-none transition-all"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Plus size={18} className="rotate-45" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={verdictFilter}
                        onChange={(e) => setVerdictFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-ruju-blue/20 outline-none"
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
                        className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-ruju-blue/20 outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Article' : 'Create New Article'}</h2>
                            {lastSaved && !editingId && (
                                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-100 flex items-center gap-1.5 animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    Draft saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => { setShowForm(false); setEditingId(null); }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title (English) *</label>
                                    <input
                                        type="text"
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-red focus:border-ruju-red transition-colors border"
                                        placeholder="Enter English title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title (Nepali)</label>
                                    <input
                                        type="text"
                                        value={formData.title_np}
                                        onChange={(e) => setFormData({ ...formData, title_np: e.target.value })}
                                        className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-red focus:border-ruju-red transition-colors border"
                                        placeholder="नेपाली शीर्षक हाल्नुहोस्"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">URL Slug *</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => {
                                                setFormData({ ...formData, slug: e.target.value });
                                                setIsAutoSlug(false);
                                            }}
                                            className="block flex-1 px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-red focus:border-ruju-red transition-colors border font-mono text-sm"
                                            placeholder="url-slug-example"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAutoSlug(true);
                                                setFormData({ ...formData, slug: generateSlug(formData.title_en) });
                                            }}
                                            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                                            title="Regenerate from title"
                                        >
                                            Auto
                                        </button>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Only lowercase letters, numbers, and hyphens.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Verdict *</label>
                                        <select
                                            value={formData.verdict}
                                            onChange={(e) => handleFormChange({ verdict: e.target.value })}
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-blue focus:border-ruju-blue transition-colors border"
                                        >
                                            <option value="TRUE">True</option>
                                            <option value="FALSE">False</option>
                                            <option value="MISLEADING">Misleading</option>
                                            <option value="UNVERIFIED">Unverified</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Status *</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleFormChange({ status: e.target.value })}
                                            className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-blue focus:border-ruju-blue transition-colors border"
                                        >
                                            <option value="DRAFT">Draft</option>
                                            <option value="PUBLISHED">Published</option>
                                            <option value="ARCHIVED">Archived</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={formData.category}
                                                onChange={(e) => handleFormChange({ category: e.target.value })}
                                                className="block flex-1 px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-blue focus:border-ruju-blue transition-colors border"
                                                required
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="New..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const newCat = e.currentTarget.value.trim();
                                                        if (newCat && !categories.includes(newCat)) {
                                                            setCategories(prev => [...prev, newCat]);
                                                            handleFormChange({ category: newCat });
                                                            e.currentTarget.value = '';
                                                        }
                                                    }
                                                }}
                                                className="block w-20 px-2 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-blue focus:border-ruju-blue transition-colors border text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Featured Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.image_url}
                                            onChange={(e) => handleFormChange({ image_url: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                            className="block flex-1 px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-ruju-blue focus:border-ruju-blue transition-colors border"
                                        />
                                        <label className="cursor-pointer bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center">
                                            <Plus className="h-5 w-5 text-gray-600" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    try {
                                                        const res = await api.uploadImage(file);
                                                        const url = res.url || res.path || res.imageUrl;
                                                        if (url) {
                                                            // Use relative path since we have a proxy
                                                            handleFormChange({ image_url: url });
                                                        }
                                                    } catch (err) {
                                                        alert('Upload failed');
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <BilingualEditor
                                label="Summary"
                                contentEn={formData.summary_en}
                                contentNp={formData.summary_np}
                                onChangeEn={(content) => handleFormChange({ summary_en: content })}
                                onChangeNp={(content) => handleFormChange({ summary_np: content })}
                                placeholderEn="Write summary in English..."
                                placeholderNp="नेपालीमा सारांश लेख्नुहोस्..."
                            />

                            <BilingualEditor
                                label="Main Content"
                                contentEn={formData.content_en}
                                contentNp={formData.content_np}
                                onChangeEn={(content) => handleFormChange({ content_en: content })}
                                onChangeNp={(content) => handleFormChange({ content_np: content })}
                                placeholderEn="Write content in English..."
                                placeholderNp="नेपालीमा लेख्नुहोस्..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setEditingId(null); }}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-ruju-red focus:outline-none transition-all duration-200 flex items-center disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : (editingId ? 'Update Article' : 'Publish Article')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Article Info</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Verdict</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center">
                                            {(article.image_url || article.imageUrl) && (
                                                <img className="h-10 w-16 object-cover rounded mr-4" src={article.image_url || article.imageUrl} alt="" />
                                            )}
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 line-clamp-1">{article.title}</div>
                                                <div className="text-xs text-ruju-red font-mono">{article.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getVerdictColor(article.verdict)}`}>
                                            {article.verdict}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusColor(article.status)}`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded font-medium">{article.category}</span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-500">
                                        {article.date ? new Date(article.date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="inline-flex items-center p-2 border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                            title="Edit Article"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="inline-flex items-center p-2 border border-red-100 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                            title="Delete Article"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
