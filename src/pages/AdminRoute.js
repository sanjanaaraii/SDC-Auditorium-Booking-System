import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../App';

const AdminRoute = () => {
    const { auth } = useContext(AuthContext);

    
    return auth.token && auth.user?.role === 'admin' ? <Outlet /> : <Navigate to="/auth" />;
};

export default AdminRoute;