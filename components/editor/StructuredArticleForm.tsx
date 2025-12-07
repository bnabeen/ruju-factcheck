import React, { useState, useEffect } from 'react';
import BilingualEditor from './BilingualEditor';
import { Save, Eye } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
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
                    <label className="block text-sm font-bold mb-2">शीर्षक (नेपाली)</label>
                    <input
                        type="text"
                        value={formData.title_np}
                        onChange={(e) => setFormData({ ...formData, title_np: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Summary (English) *</label>
                    <textarea
                        value={formData.summary_en}
                        onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        rows={3}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">सारांश (नेपाली)</label>
                    <textarea
                        value={formData.summary_np}
                        onChange={(e) => setFormData({ ...formData, summary_np: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        rows={3}
                    />
                </div>
            </div>

            {/* Claim Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">1. Claim</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Claim Text *</label>
                        <textarea
                            value={formData.claim_text}
                            onChange={(e) => setFormData({ ...formData, claim_text: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                            rows={2}
                            placeholder="The exact claim being fact-checked..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Claim Source URL</label>
                        <input
                            type="url"
                            value={formData.claim_source_url}
                            onChange={(e) => setFormData({ ...formData, claim_source_url: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            {/* Investigation Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">2. Investigation</h3>
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
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">3. Evidence</h3>
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
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-4">4. Verdict & Conclusion</h3>
                <div className="space-y-4">
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
                    <BilingualEditor
                        contentEn={formData.conclusion_text}
                        contentNp=""
                        onChangeEn={(content) => setFormData({ ...formData, conclusion_text: content })}
                        onChangeNp={() => { }}
                        label="Conclusion"
                        placeholderEn="Summarize your findings..."
                    />
                </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Category *</label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Politics, Health, etc."
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Featured Image URL</label>
                    <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-ruju-red text-white px-6 py-2 rounded font-bold hover:bg-black transition disabled:opacity-50"
                >
                    {submitting ? 'Publishing...' : 'Publish Article'}
                </button>
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="bg-gray-300 text-black px-6 py-2 rounded font-bold hover:bg-gray-400 transition flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Draft
                </button>
            </div>
        </form>
    );
};

export default StructuredArticleForm;
