import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const API_URL = 'http://localhost:5000/api/auth';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const endpoint = isLogin ? '/login' : '/register';
        
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, formData);
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            setAuth({ token, user });

            if (user.role === 'admin') {
                navigate('/admin'); 
            } else {
                navigate('/book'); 
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'An error occurred.';
            
            if (errorMsg.includes('expired')) {
                setMessage({ type: 'error', text: 'Session expired. Please log in again.' });
                
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setAuth({ token: null, user: null });
                delete axios.defaults.headers.common['Authorization'];
            } else {
     setMessage({ type: 'error', text: errorMsg });
            }
            } 
            
            finally {
         setLoading(false);}
        };

    return (
        <div className="form-container">
            <div className="auth-tabs">
                <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>
                    Login
                </button>
                <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>
                    Signup
                </button>
            </div>

            {message.text && <div className={`message-container message-${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                </button>
            </form>
        </div>
    );
};

export default AuthPage;

