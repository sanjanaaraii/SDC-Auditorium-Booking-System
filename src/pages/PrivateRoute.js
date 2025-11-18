import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../App';

const PrivateRoute = () => {
    const { auth } = useContext(AuthContext);

    // If user is authenticated, render the child routes. Otherwise, redirect to login.
    return auth.token ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute;