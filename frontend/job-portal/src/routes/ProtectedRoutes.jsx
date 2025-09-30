import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
    return <Outlet />;

  
}

export default ProtectedRoutes
