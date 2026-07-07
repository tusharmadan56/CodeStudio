import axios from 'axios';

import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials: true, // send the refresh-token cookie
});

axiosInstance.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

// On these, a 401 is a genuine answer (bad creds / no session), not an expired access token to refresh.
const NO_AUTO_REFRESH = ['/auth/login', '/auth/signup', '/auth/refresh'];
let refreshRequest = null;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const skip = NO_AUTO_REFRESH.some((path) => original?.url?.includes(path));
        if (error.response?.status !== 401 || original?._retry || skip) {
            return Promise.reject(error);
        }

        original._retry = true;
        try {
            // Share one refresh so several parallel 401s don't each fire their own.
            refreshRequest = refreshRequest ?? axiosInstance.post('/auth/refresh');
            const { data } = await refreshRequest;
            useAuthStore.getState().setAccessToken(data.data.accessToken);
            original.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return axiosInstance(original);
        } catch (refreshError) {
            useAuthStore.getState().clearAuth();
            return Promise.reject(refreshError);
        } finally {
            refreshRequest = null;
        }
    },
);

export default axiosInstance;
