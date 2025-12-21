import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Users, Mail, TrendingUp, Briefcase, Settings, Edit3, Plus } from 'lucide-react';
import { api } from '../../services/api';
import StructuredArticleForm from '../../components/editor/StructuredArticleForm';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Editor modal state (move hooks here so they are called on every render)
    const [showEditor, setShowEditor] = useState(false);
    const [editorSubmitting, setEditorSubmitting] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getAdminStats();
                setStats(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch stats', error);
                setError(error instanceof Error ? error.message : 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-20">Loading...</div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="text-red-600 mb-4">Error: {error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-ruju-red text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Articles', value: stats?.totalArticles || 0, icon: FileText, color: 'bg-blue-500', link: '/admin/articles' },
        { label: 'Pending Claims', value: stats?.pendingClaims || 0, icon: AlertCircle, color: 'bg-yellow-500', link: '/admin/claims' },
        { label: 'Newsletter Subscribers', value: stats?.newsletterSubscribers || 0, icon: Mail, color: 'bg-green-500', link: '/admin/newsletter' },
        { label: 'Pending Applications', value: stats?.pendingApplications || 0, icon: TrendingUp, color: 'bg-purple-500', link: '/admin/careers' },
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-indigo-500', link: '/admin/users' },
    ];


    const quickActions = [
        { href: '#/admin/articles', icon: Plus, label: 'New Article', desc: 'Create fact-check article', color: 'text-blue-600' },
        { href: '#/admin/claims', icon: AlertCircle, label: 'Review Claims', desc: 'Check pending submissions', color: 'text-yellow-600' },
        { href: '#/admin/content', icon: Edit3, label: 'Edit Pages', desc: 'Update About, Terms, etc.', color: 'text-green-600' },
        { href: '#/admin/careers', icon: Briefcase, label: 'Manage Jobs', desc: 'Post & review applications', color: 'text-purple-600' },
        { href: '#/admin/settings', icon: Settings, label: 'Site Settings', desc: 'Configure navigation & branding', color: 'text-gray-600' },
        { href: '#/admin/newsletter', icon: Mail, label: 'Newsletter', desc: 'Export subscriber list', color: 'text-green-600' },
        { href: '#', icon: Edit3, label: 'Open Editor', desc: 'Quickly write a new article', color: 'text-blue-600', onClick: () => setShowEditor(true) },
    ];

    const handleEditorSubmit = async (data: any) => {
        setEditorSubmitting(true);
        try {
            await api.createArticle(data);
            alert('Article created successfully');
            setShowEditor(false);
            // refresh stats
            const latest = await api.getAdminStats();
            setStats(latest);
        } catch (err) {
            console.error('Failed to create article', err);
            alert('Failed to create article');
        } finally {
            setEditorSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to RUJU CMS - Manage your fact-checking platform</p>
            </div>

            {/* Editor Modal */}
            {showEditor && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setShowEditor(false)}></div>
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 z-10 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Quick Article Editor</h3>
                            <button onClick={() => setShowEditor(false)} className="text-gray-600 hover:text-black">Close</button>
                        </div>
                        <StructuredArticleForm
                            onSubmit={handleEditorSubmit}
                            onSaveDraft={(data) => { localStorage.setItem('admin_article_draft', JSON.stringify(data)); alert('Draft saved locally'); }}
                        />
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <a
                            key={index}
                            href={`#${stat.link}`}
                            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-black mt-2 group-hover:text-ruju-red transition">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
