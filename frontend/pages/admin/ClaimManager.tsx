import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

const ClaimManager: React.FC = () => {
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

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
        setUpdatingIds(prev => new Set(prev).add(id));
        try {
            await api.updateClaimStatus(id, status);
            // Optimistically update the claim in the list
            setClaims(prevClaims => 
                prevClaims.map(claim => 
                    claim.id === id ? { ...claim, status } : claim
                )
            );
        } catch (error) {
            console.error('Failed to update claim', error);
            alert('Failed to update claim status. Please try again.');
            // Refresh to get correct state
            fetchClaims();
        } finally {
            setUpdatingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-ruju-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Claims Management</h1>
                <p className="text-gray-500 mt-2">Review and manage submitted claims for fact-checking.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle sm:px-0">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Claim</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Source</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Status</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Date</th>
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {claims.map((claim) => {
                                    const isUpdating = updatingIds.has(claim.id);
                                    return (
                                        <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="max-w-md">
                                                    <p className="text-sm text-gray-900 line-clamp-2">{claim.claim_text}</p>
                                                    <div className="md:hidden mt-2 flex items-center gap-2">
                                                        {claim.source_url && (
                                                            <a 
                                                                href={claim.source_url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium"
                                                            >
                                                                View Source
                                                            </a>
                                                        )}
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                                            claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            claim.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                                                            claim.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {claim.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                                                {claim.source_url ? (
                                                    <a 
                                                        href={claim.source_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                                                    >
                                                        View Source
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">No source</span>
                                                )}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    claim.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                                                    claim.status === 'verified' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">
                                                {new Date(claim.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(claim.id, 'verified')}
                                                        disabled={isUpdating || claim.status === 'verified'}
                                                        className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
                                                            claim.status === 'verified'
                                                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                                : 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        title="Mark as Verified"
                                                    >
                                                        {isUpdating && claim.status !== 'verified' ? (
                                                            <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <CheckCircle size={14} />
                                                        )}
                                                        <span className="hidden sm:inline">Verified</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(claim.id, 'reviewing')}
                                                        disabled={isUpdating || claim.status === 'reviewing'}
                                                        className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
                                                            claim.status === 'reviewing'
                                                                ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-sm'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        title="Mark as Reviewing"
                                                    >
                                                        {isUpdating && claim.status !== 'reviewing' ? (
                                                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Clock size={14} />
                                                        )}
                                                        <span className="hidden sm:inline">Reviewing</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(claim.id, 'rejected')}
                                                        disabled={isUpdating || claim.status === 'rejected'}
                                                        className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
                                                            claim.status === 'rejected'
                                                                ? 'bg-red-100 text-red-700 cursor-not-allowed'
                                                                : 'bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-sm'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        title="Mark as Rejected"
                                                    >
                                                        {isUpdating && claim.status !== 'rejected' ? (
                                                            <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <XCircle size={14} />
                                                        )}
                                                        <span className="hidden sm:inline">Rejected</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {claims.length === 0 && (
                    <div className="text-center py-20">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No claims</h3>
                        <p className="mt-1 text-sm text-gray-500">No claims have been submitted yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClaimManager;
