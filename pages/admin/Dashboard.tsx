import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Users, Mail, TrendingUp, Briefcase, Settings, Edit3, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import StructuredArticleForm from '../../components/editor/StructuredArticleForm';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Editor modal state
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
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-ruju-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="text-red-600 mb-4 font-medium">Error: {error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-ruju-red text-white rounded-lg hover:bg-black transition shadow-md"
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
        { to: '/admin/articles/new', icon: Plus, label: 'New Article', desc: 'Create fact-check article', color: 'text-blue-600' },
        { to: '/admin/claims', icon: AlertCircle, label: 'Review Claims', desc: 'Check pending submissions', color: 'text-yellow-600' },
        { to: '/admin/content', icon: Edit3, label: 'Edit Pages', desc: 'Update About, Terms, etc.', color: 'text-green-600' },
        { to: '/admin/careers', icon: Briefcase, label: 'Manage Jobs', desc: 'Post & review applications', color: 'text-purple-600' },
        { to: '/admin/settings', icon: Settings, label: 'Site Settings', desc: 'Configure navigation & branding', color: 'text-gray-600' },
        { to: '/admin/newsletter', icon: Mail, label: 'Newsletter', desc: 'Export subscriber list', color: 'text-green-600' },
    ];

    const handleEditorSubmit = async (data: any) => {
        setEditorSubmitting(true);
        try {
            await api.createArticle(data);
            alert('Article created successfully');
            setShowEditor(false);
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
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-500 mt-2 text-lg">Welcome back. Here's what's happening on RUJU CMS today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            to={stat.link}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-ruju-red/20 transition-all group cursor-pointer block"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight group-hover:text-ruju-red transition-colors">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={index}
                            to={action.to}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md hover:border-ruju-red/10 transition-all flex items-start gap-4 group"
                        >
                            <div className={`${action.color} p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-ruju-red transition-colors">{action.label}</h3>
                                <p className="text-gray-500 mt-1 leading-relaxed">{action.desc}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Editor Modal (Maintained for backward compatibility if needed, but we prefer dedicated route) */}
            {showEditor && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 overflow-y-auto pb-10">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditor(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 z-10 p-8">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 className="text-2xl font-bold text-gray-900">Quick Article Editor</h3>
                            <button onClick={() => setShowEditor(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
                                <Plus className="rotate-45" size={28} />
                            </button>
                        </div>
                        <StructuredArticleForm
                            onSubmit={handleEditorSubmit}
                            onSaveDraft={(data) => { localStorage.setItem('admin_article_draft', JSON.stringify(data)); alert('Draft saved locally'); }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
