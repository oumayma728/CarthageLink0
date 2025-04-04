// components/ProtectedRoute.js
import { useAuth } from"../../contexts/AuthContext.js";
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
}

export function RoleProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log('Current user role:', user?.role); 
  console.log('Allowed roles:', allowedRoles); 
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}

// Prop types
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

RoleProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
};