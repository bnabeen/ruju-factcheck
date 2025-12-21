import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ClaimManager: React.FC = () => {
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const data = await api.getClaims();
            setClaims(data);
        } catch (error) {
            console.error('Failed to fetch claims', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await api.updateClaimStatus(id, status);
            fetchClaims();
        } catch (error) {
            console.error('Failed to update claim', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">Loading...</div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-black mb-8">Claims</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Claim</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 max-w-md truncate">{claim.claim_text}</td>
                                <td className="px-6 py-4">
                                    {claim.source_url && (
                                        <a href={claim.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            Link
                                        </a>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        claim.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                                            claim.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(claim.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={claim.status}
                                        onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewing">Reviewing</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClaimManager;
