import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Download } from 'lucide-react';

const NewsletterManager: React.FC = () => {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const data = await api.getNewsletterSubscribers();
            setSubscribers(data);
        } catch (error) {
            console.error('Failed to fetch subscribers', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const csv = [
            ['Email', 'Subscribed Date'],
            ...subscribers.map(sub => [sub.email, new Date(sub.created_at).toLocaleDateString()])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="text-center py-20">Loading...</div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">Newsletter Subscribers</h1>
                <button
                    onClick={exportToCSV}
                    className="bg-ruju-red text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition flex items-center gap-2"
                >
                    <Download size={20} />
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Subscribed Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{subscriber.email}</td>
                                <td className="px-6 py-4">{new Date(subscriber.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsletterManager;
