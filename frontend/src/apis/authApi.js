import axiosInstance from '../config/axiosConfig';

export const signupApi = async (payload) => {
    const { data } = await axiosInstance.post('/auth/signup', payload);
    return data.data;
};

export const loginApi = async (payload) => {
    const { data } = await axiosInstance.post('/auth/login', payload);
    return data.data;
};

export const logoutApi = async () => {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
};

export const refreshApi = async () => {
    const { data } = await axiosInstance.post('/auth/refresh');
    return data.data;
};

export const meApi = async () => {
    const { data } = await axiosInstance.get('/auth/me');
    return data.data;
};
