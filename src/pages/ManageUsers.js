
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/users';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await axios.get(API_URL);
                setUsers(res.data);
            } catch (err) {
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-center">Loading users...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b last:border-none">
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3 capitalize">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;