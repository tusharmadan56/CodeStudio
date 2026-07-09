import axiosInstance from '../config/axiosConfig';

export const getMyProjectsApi = async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
};
