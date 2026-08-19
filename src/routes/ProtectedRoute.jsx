import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, isAuthenticated } = useAuth();

  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackPath =
      user.role === 'VENDOR' ? '/vendor/dashboard' : '/spaces';

    if (window.location.pathname === fallbackPath) {
      return <Navigate to="/login" replace />;
    }

    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}
