import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save } from 'lucide-react';

const SiteSettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await api.getSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateSettings(settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">Loading...</div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">Site Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-ruju-red text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition flex items-center gap-2 disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">
                {/* Navigation Links */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Navigation Links</h2>
                    <div className="space-y-4">
                        {settings?.navigation?.links?.map((link: any, index: number) => (
                            <div key={index} className="grid grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.navigation.links[index].label = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="px-3 py-2 border rounded"
                                    placeholder="Label (EN)"
                                />
                                <input
                                    type="text"
                                    value={link.label_np}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.navigation.links[index].label_np = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="px-3 py-2 border rounded"
                                    placeholder="Label (NP)"
                                />
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.navigation.links[index].url = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="px-3 py-2 border rounded"
                                    placeholder="URL"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Footer Links</h2>
                    <div className="space-y-4">
                        {settings?.footer_resources?.links?.map((link: any, index: number) => (
                            <div key={index} className="grid grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.footer_resources.links[index].label = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="px-3 py-2 border rounded"
                                    placeholder="Label (EN)"
                                />
                                <input
                                    type="text"
                                    value={link.label_np}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.footer_resources.links[index].label_np = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="px-3 py-2 border rounded"
                                    placeholder="Label (NP)"
                                />
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.footer_resources.links[index].url = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="px-3 py-2 border rounded"
                                    placeholder="URL"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Branding */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Branding</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Logo URL</label>
                            <input
                                type="url"
                                value={settings?.branding?.logo_url || ''}
                                onChange={(e) => {
                                    const newSettings = { ...settings };
                                    newSettings.branding.logo_url = e.target.value;
                                    setSettings(newSettings);
                                }}
                                className="w-full px-3 py-2 border rounded"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Tagline (English)</label>
                                <input
                                    type="text"
                                    value={settings?.branding?.tagline_en || ''}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.branding.tagline_en = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Tagline (Nepali)</label>
                                <input
                                    type="text"
                                    value={settings?.branding?.tagline_np || ''}
                                    onChange={(e) => {
                                        const newSettings = { ...settings };
                                        newSettings.branding.tagline_np = e.target.value;
                                        setSettings(newSettings);
                                    }}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteSettingsManager;
