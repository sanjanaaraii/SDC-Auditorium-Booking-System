import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ManageUsers.css";   

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

    if (loading) return <div className="center-text">Loading users...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="users-container">
            <h2 className="page-title">Manage Users</h2>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="table-card">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="role">{user.role}</td>
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
