import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { signupApi } from '../../apis/authApi';
import { useAuthStore } from '../../store/authStore';

export const useSignup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: signupApi,
        onSuccess: ({ user, accessToken }) => {
            setAuth({ user, accessToken });
            navigate(location.state?.from?.pathname ?? '/', { replace: true });
        },
    });
};
