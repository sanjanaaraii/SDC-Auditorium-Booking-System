import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../App';

const AdminRoute = () => {
    const { auth } = useContext(AuthContext);

    // If user is authenticated and is an admin, render the child routes.
    // Otherwise, redirect to the login page.
    return auth.token && auth.user?.role === 'admin' ? <Outlet /> : <Navigate to="/auth" />;
};

export default AdminRoute;