import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { loginApi } from '../../apis/authApi';
import { useAuthStore } from '../../store/authStore';

export const useLogin = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    return useMutation({
        mutationFn: loginApi,
        onSuccess: ({ user, accessToken }) => {
            setAuth({ user, accessToken });
            navigate('/');
        },
    });
};
