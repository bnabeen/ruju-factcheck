import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

const CareerManager: React.FC = () => {
    const [careers, setCareers] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'careers' | 'applications'>('careers');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'full-time',
        description: '',
        requirements: '',
        responsibilities: '',
        is_active: true,
    });

    useEffect(() => {
        fetchCareers();
        fetchApplications();
    }, []);

    const fetchCareers = async () => {
        try {
            const data = await api.getAllCareers();
            setCareers(data);
        } catch (error) {
            console.error('Failed to fetch careers', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const data = await api.getJobApplications();
            setApplications(data);
        } catch (error) {
            console.error('Failed to fetch applications', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.updateCareer(editingId, formData);
            } else {
                await api.createCareer(formData);
            }
            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchCareers();
        } catch (error) {
            console.error('Failed to save career', error);
            alert('Failed to save career');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.deleteCareer(id);
            fetchCareers();
        } catch (error) {
            console.error('Failed to delete career', error);
        }
    };

    const handleApplicationStatusChange = async (id: string, status: string) => {
        try {
            await api.updateApplicationStatus(id, status);
            fetchApplications();
        } catch (error) {
            console.error('Failed to update application', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            department: '',
            location: '',
            type: 'full-time',
            description: '',
            requirements: '',
            responsibilities: '',
            is_active: true,
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-black mb-8">Careers</h1>

            <div className="mb-6 flex gap-4">
                <button
                    onClick={() => setActiveTab('careers')}
                    className={`px-4 py-2 rounded font-bold ${activeTab === 'careers' ? 'bg-ruju-red text-white' : 'bg-gray-200'}`}
                >
                    Job Listings
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 rounded font-bold ${activeTab === 'applications' ? 'bg-ruju-red text-white' : 'bg-gray-200'}`}
                >
                    Applications ({applications.length})
                </button>
            </div>

            {activeTab === 'careers' && (
                <>
                    <button
                        onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
                        className="bg-ruju-red text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition flex items-center gap-2 mb-6"
                    >
                        <Plus size={20} />
                        New Job
                    </button>

                    {showForm && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Job' : 'New Job'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Department</label>
                                        <input
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Type *</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Active</label>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Description *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" className="bg-ruju-red text-white px-6 py-2 rounded font-bold hover:bg-black transition">
                                        {editingId ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowForm(false); setEditingId(null); }}
                                        className="bg-gray-300 text-black px-6 py-2 rounded font-bold hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {careers.map((career) => (
                                    <tr key={career.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{career.title}</td>
                                        <td className="px-6 py-4">{career.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded ${career.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {career.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => { setFormData(career); setEditingId(career.id); setShowForm(true); }} className="text-blue-600 hover:text-blue-800 mr-3">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(career.id)} className="text-red-600 hover:text-red-800">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'applications' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">{app.full_name}</td>
                                    <td className="px-6 py-4">{app.email}</td>
                                    <td className="px-6 py-4">{app.career_title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(app.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleApplicationStatusChange(app.id, e.target.value)}
                                            className="px-2 py-1 border rounded text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CareerManager;
