import axiosInstance from '../config/axiosConfig';

export const createProjectApi = async (payload) => {
    const response = await axiosInstance.post('/projects', payload);
    return response.data;
};
