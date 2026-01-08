import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import StructuredArticleForm from '../../components/editor/StructuredArticleForm';
import { Language } from '../../types';

const ArticleEditorPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    // We use EN as default to get all fields, but the backend returns all fields regardless.
                    const data = await api.getArticleById(id, Language.EN);
                    setInitialData(data);
                } catch (err) {
                    console.error('Failed to fetch article:', err);
                    setError('Failed to load article for editing.');
                } finally {
                    setLoading(false);
                }
            };
            fetchArticle();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleSubmit = async (formData: any) => {
        try {
            if (id) {
                await api.updateArticle(id, formData);
                alert('Article updated successfully');
            } else {
                await api.createArticle(formData);
                alert('Article created successfully');
            }
            navigate('/admin/articles');
        } catch (err: any) {
            console.error('Save failed:', err);
            alert(err.message || 'Failed to save article');
            throw err; // Re-throw to StructuredArticleForm to reset loading state
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-ruju-red border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Loading Editor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-red-700 font-bold mb-4">{error}</p>
                <button
                    onClick={() => navigate('/admin/articles')}
                    className="bg-ruju-red text-white px-6 py-2 rounded-lg hover:bg-black transition"
                >
                    Back to Articles
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        {id ? 'Edit Article' : 'Create New Article'}
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        {id ? 'Modify your existing fact-check article.' : 'Write a new fact-check article for RUJU.'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/articles')}
                    className="self-start sm:self-auto px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition rounded-lg border border-gray-200"
                >
                    Cancel
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <StructuredArticleForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default ArticleEditorPage;
