import React, { useState, useEffect } from 'react';
import BilingualEditor from './BilingualEditor';
import CategoryAutocomplete from './CategoryAutocomplete';
import { Save, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { Language } from '../../types';

interface StructuredArticleFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onSaveDraft?: (data: any) => void;
}

const StructuredArticleForm: React.FC<StructuredArticleFormProps> = ({
    initialData,
    onSubmit,
    onSaveDraft,
}) => {
    const [formData, setFormData] = useState({
        title_en: initialData?.title_en || '',
        title_np: initialData?.title_np || '',
        summary_en: initialData?.summary_en || '',
        summary_np: initialData?.summary_np || '',
        claim_text: initialData?.claim_text || '',
        claim_source_url: initialData?.claim_source_url || '',
        investigation_text: initialData?.investigation_text || '',
        evidence_text: initialData?.evidence_text || '',
        evidence_urls: initialData?.evidence_urls || [],
        conclusion_text: initialData?.conclusion_text || '',
        verdict: initialData?.verdict || 'UNVERIFIED',
        category: initialData?.category || '',
        image_url: initialData?.image_url || '',
        og_image: initialData?.og_image || '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    // Load categories from localStorage and articles
    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Load from localStorage
                const savedCategories = localStorage.getItem('article_categories');
                const localCategories = savedCategories ? JSON.parse(savedCategories) : [];

                // Try to fetch from articles API to get existing categories
                try {
                    const articles = await api.getArticles(Language.EN, 100);
                    const articleCategories = [...new Set(articles.map((a: any) => a.category).filter(Boolean))];
                    const allCategories = [...new Set([...localCategories, ...articleCategories])];
                    setCategories(allCategories);
                    localStorage.setItem('article_categories', JSON.stringify(allCategories));
                } catch (err) {
                    // If API fails, just use localStorage categories
                    setCategories(localCategories);
                }
            } catch (err) {
                console.error('Failed to load categories', err);
                setCategories(['Politics', 'Health', 'Technology', 'Education', 'Economy']);
            }
        };
        loadCategories();
    }, []);

    const handleAddCategory = (category: string) => {
        if (!categories.includes(category)) {
            const updatedCategories = [...categories, category];
            setCategories(updatedCategories);
            localStorage.setItem('article_categories', JSON.stringify(updatedCategories));
        }
    };

    // Autosave to localStorage
    useEffect(() => {
        const autosaveInterval = setInterval(() => {
            localStorage.setItem('article_draft', JSON.stringify(formData));
        }, 30000); // Every 30 seconds

        return () => clearInterval(autosaveInterval);
    }, [formData]);

    // Load from localStorage on mount
    useEffect(() => {
        const draft = localStorage.getItem('article_draft');
        if (draft && !initialData) {
            const shouldRestore = confirm('Found a saved draft. Would you like to restore it?');
            if (shouldRestore) {
                setFormData(JSON.parse(draft));
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(formData);
            localStorage.removeItem('article_draft');
        } catch (error) {
            console.error('Submit failed:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveDraft = () => {
        if (onSaveDraft) {
            onSaveDraft(formData);
        }
        localStorage.setItem('article_draft', JSON.stringify(formData));
        alert('Draft saved!');
    };

    return (
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 sm:px-8 py-6 border-b border-gray-200">
                <div className="space-y-6">
                    {/* Title */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Title (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title_en}
                                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400"
                                placeholder="Enter article title in English..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                शीर्षक (नेपाली)
                            </label>
                            <input
                                type="text"
                                value={formData.title_np}
                                onChange={(e) => setFormData({ ...formData, title_np: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400"
                                placeholder="नेपाली शीर्षक हाल्नुहोस्..."
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Summary (English) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.summary_en}
                                onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-y min-h-[100px]"
                                rows={4}
                                placeholder="Write a brief summary in English..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                सारांश (नेपाली)
                            </label>
                            <textarea
                                value={formData.summary_np}
                                onChange={(e) => setFormData({ ...formData, summary_np: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-y min-h-[100px]"
                                rows={4}
                                placeholder="नेपालीमा सारांश लेख्नुहोस्..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Claim Section */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 bg-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">1</div>
                    <h3 className="text-xl font-bold text-gray-900">Claim</h3>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Claim Text <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.claim_text}
                            onChange={(e) => setFormData({ ...formData, claim_text: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400 resize-y min-h-[100px]"
                            rows={4}
                            placeholder="Enter the exact claim being fact-checked..."
                            required
                        />
                        <p className="mt-1.5 text-xs text-gray-500">The exact statement or claim that needs to be verified</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Claim Source URL</label>
                        <input
                            type="url"
                            value={formData.claim_source_url}
                            onChange={(e) => setFormData({ ...formData, claim_source_url: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400"
                            placeholder="https://example.com/source..."
                        />
                        <p className="mt-1.5 text-xs text-gray-500">URL where the claim was originally found</p>
                    </div>
                </div>
            </div>

            {/* Investigation Section */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 bg-gray-50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">2</div>
                    <h3 className="text-xl font-bold text-gray-900">Investigation</h3>
                </div>
                <BilingualEditor
                    contentEn={formData.investigation_text}
                    contentNp=""
                    onChangeEn={(content) => setFormData({ ...formData, investigation_text: content })}
                    onChangeNp={() => { }}
                    label="Investigation Process"
                    placeholderEn="Describe how you investigated this claim..."
                />
            </div>

            {/* Evidence Section */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 bg-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">3</div>
                    <h3 className="text-xl font-bold text-gray-900">Evidence</h3>
                </div>
                <BilingualEditor
                    contentEn={formData.evidence_text}
                    contentNp=""
                    onChangeEn={(content) => setFormData({ ...formData, evidence_text: content })}
                    onChangeNp={() => { }}
                    label="Evidence Found"
                    placeholderEn="Present the evidence you found..."
                />
            </div>

            {/* Verdict & Conclusion */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 bg-gray-50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm">4</div>
                    <h3 className="text-xl font-bold text-gray-900">Verdict & Conclusion</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Verdict <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.verdict}
                            onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 bg-white"
                        >
                            <option value="TRUE">True</option>
                            <option value="FALSE">False</option>
                            <option value="MISLEADING">Misleading</option>
                            <option value="UNVERIFIED">Unverified</option>
                        </select>
                    </div>
                    <BilingualEditor
                        contentEn={formData.conclusion_text}
                        contentNp=""
                        onChangeEn={(content) => setFormData({ ...formData, conclusion_text: content })}
                        onChangeNp={() => { }}
                        label="Conclusion"
                        placeholderEn="Summarize your findings and provide a clear conclusion..."
                    />
                </div>
            </div>

            {/* Metadata */}
            <div className="px-6 sm:px-8 py-6 sm:py-8 bg-white border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Article Metadata</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <CategoryAutocomplete
                            value={formData.category}
                            onChange={(category) => setFormData({ ...formData, category })}
                            categories={categories}
                            onAddCategory={handleAddCategory}
                            required
                            placeholder="Type to search or add new category..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Featured Image URL</label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ruju-red focus:border-ruju-red transition-all outline-none text-gray-900 placeholder:text-gray-400"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="mt-1.5 text-xs text-gray-500">URL for the article's featured image</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-all min-h-[44px]"
                >
                    <Save size={18} />
                    Save Draft
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center px-8 py-3 bg-ruju-red text-white rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg min-h-[44px]"
                >
                    {submitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Publishing...
                        </>
                    ) : (
                        'Publish Article'
                    )}
                </button>
            </div>
        </form>
    );
};

export default StructuredArticleForm;
