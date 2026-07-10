import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore';

export const ProtectedRoute = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    // remember where the user was headed (e.g. a /join/:token link) so login can send them back
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    return children;
};
