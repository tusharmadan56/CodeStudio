import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { logoutApi } from '../../apis/authApi';
import { useAuthStore } from '../../store/authStore';

export const useLogout = () => {
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);

    // Clear local auth and leave regardless — a failed logout call still means the user wants out.
    const leave = () => {
        clearAuth();
        navigate('/login');
    };

    return useMutation({ mutationFn: logoutApi, onSuccess: leave, onError: leave });
};
