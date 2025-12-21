import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (id: string, role: string) => {
        try {
            await api.updateUserRole(id, role);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user role', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">Loading...</div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-black mb-8">Users</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{user.full_name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                        user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        <option value="user">User</option>
                                        <option value="editor">Editor</option>
                                        <option value="admin">Admin</option>
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

export default UserManager;
