import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import RichTextEditor from '../../components/editor/RichTextEditor';

const ContentManager: React.FC = () => {
    const [pages, setPages] = useState<any[]>([]);
    const [selectedPage, setSelectedPage] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '', content: '', meta_description: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const data = await api.getAllPages();
            setPages(data);
            if (data.length > 0) {
                loadPage(data[0].slug);
            }
        } catch (error) {
            console.error('Failed to fetch pages', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPage = async (slug: string) => {
        try {
            const data = await api.getPageContent(slug);
            setSelectedPage(data);
            setFormData({
                title: data.title,
                content: data.content,
                meta_description: data.meta_description || '',
            });
        } catch (error) {
            console.error('Failed to load page', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPage) return;

        try {
            await api.updatePageContent(selectedPage.slug, formData);
            alert('Page updated successfully');
            fetchPages();
        } catch (error) {
            console.error('Failed to update page', error);
            alert('Failed to update page');
        }
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
                <h1 className="text-3xl font-bold text-black mb-8">Content Pages</h1>

                <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1 bg-white rounded-lg shadow-md p-4">
                        <h2 className="font-bold mb-4">Pages</h2>
                        <div className="space-y-2">
                            {pages.map((page) => (
                                <button
                                    key={page.slug}
                                    onClick={() => loadPage(page.slug)}
                                    className={`w-full text-left px-3 py-2 rounded transition ${selectedPage?.slug === page.slug ? 'bg-ruju-red text-white' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {page.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-3 bg-white rounded-lg shadow-md p-6">
                        {selectedPage && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Meta Description</label>
                                    <input
                                        type="text"
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Content</label>
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        placeholder="Write page content..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-ruju-red text-white px-6 py-2 rounded font-bold hover:bg-black transition"
                                >
                                    Update Page
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentManager;
