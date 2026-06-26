import axiosInstance from '../config/axiosConfig';

export const createProjectApi = async () => {
    const response = await axiosInstance.post('/projects');
    return response.data;
};
