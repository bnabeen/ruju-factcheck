import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { Language } from '../../types';
import BilingualEditor from '../../components/editor/BilingualEditor';

const ArticleManager: React.FC = () => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title_en: '',
        title_np: '',
        summary_en: '',
        summary_np: '',
        content_en: '',
        content_np: '',
        verdict: 'TRUE',
        category: 'Politics',
        image_url: '',
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const data = await api.getArticles(Language.EN, 100);
            setArticles(data);
        } catch (error) {
            console.error('Failed to fetch articles', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.updateArticle(editingId, formData);
            } else {
                await api.createArticle(formData);
            }
            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchArticles();
        } catch (error) {
            console.error('Failed to save article', error);
            alert('Failed to save article');
        }
    };

    const handleEdit = (article: any) => {
        setFormData({
            title_en: article.title || '',
            title_np: article.title_np || '',
            summary_en: article.summary || '',
            summary_np: article.summary_np || '',
            content_en: article.content || '',
            content_np: article.content_np || '',
            verdict: article.verdict || 'TRUE',
            category: article.category || 'Politics',
            image_url: article.imageUrl || '',
        });
        setEditingId(article.id);
        setShowForm(true);
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
            category: 'Politics',
            image_url: '',
        });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="text-center py-20">Loading...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-black">Articles</h1>
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
                        className="bg-ruju-red text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition flex items-center gap-2"
                    >
                        <Plus size={20} />
                        New Article
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Article' : 'New Article'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Title (English) *</label>
                                    <input
                                        type="text"
                                        value={formData.title_en}
                                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Title (Nepali)</label>
                                    <input
                                        type="text"
                                        value={formData.title_np}
                                        onChange={(e) => setFormData({ ...formData, title_np: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                            </div>

                            <BilingualEditor
                                label="Summary"
                                contentEn={formData.summary_en}
                                contentNp={formData.summary_np}
                                onChangeEn={(content) => setFormData(prev => ({ ...prev, summary_en: content }))}
                                onChangeNp={(content) => setFormData(prev => ({ ...prev, summary_np: content }))}
                                placeholderEn="Write summary in English..."
                                placeholderNp="नेपालीमा सारांश लेख्नुहोस्..."
                            />

                            <BilingualEditor
                                label="Content"
                                contentEn={formData.content_en}
                                contentNp={formData.content_np}
                                onChangeEn={(content) => setFormData(prev => ({ ...prev, content_en: content }))}
                                onChangeNp={(content) => setFormData(prev => ({ ...prev, content_np: content }))}
                                placeholderEn="Write content in English..."
                                placeholderNp="नेपालीमा लेख्नुहोस्..."
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Verdict *</label>
                                    <select
                                        value={formData.verdict}
                                        onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="TRUE">True</option>
                                        <option value="FALSE">False</option>
                                        <option value="MISLEADING">Misleading</option>
                                        <option value="UNVERIFIED">Unverified</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Category *</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="bg-ruju-red text-white px-6 py-2 rounded font-bold hover:bg-black transition">
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingId(null); }}
                                    className="bg-gray-300 text-black px-6 py-2 rounded font-bold hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Verdict</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{article.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${article.verdict === 'TRUE' ? 'bg-green-100 text-green-800' :
                                            article.verdict === 'FALSE' ? 'bg-red-100 text-red-800' :
                                                article.verdict === 'MISLEADING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {article.verdict}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{article.category}</td>
                                    <td className="px-6 py-4">{article.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ArticleManager;
