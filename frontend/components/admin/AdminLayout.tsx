import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, AlertCircle, Users, FileEdit, Briefcase, Mail, LogOut, Menu, X, Settings } from 'lucide-react';
import { api } from '../../services/api';

interface AdminLayoutProps {
    children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await api.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user', error);
                navigate('/admin/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        api.logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/articles', icon: FileText, label: 'Articles' },
        { path: '/admin/claims', icon: AlertCircle, label: 'Claims' },
        { path: '/admin/content', icon: FileEdit, label: 'Pages' },
        { path: '/admin/careers', icon: Briefcase, label: 'Careers' },
        { path: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
        { path: '/admin/content-ai', icon: FileText, label: 'Ruju Content AI' },
    ];

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Overlay for mobile */}
            {!sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(true)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
                } bg-black text-white flex flex-col shadow-xl`}>
                <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
                    {sidebarOpen && <h1 className="text-xl font-bold tracking-tight text-ruju-red">RUJU <span className="text-white">Admin</span></h1>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded transition ${isActive ? 'bg-ruju-red text-white' : 'hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-ruju-red rounded-full flex items-center justify-center text-sm font-bold">
                            {user.fullName?.charAt(0) || 'U'}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.fullName}</p>
                                <p className="text-xs text-white/60 truncate">{user.role}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition"
                    >
                        <LogOut size={18} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
