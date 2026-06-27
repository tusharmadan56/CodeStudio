import axiosInstance from '../config/axiosConfig';

export const getProjectTreeApi = async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}`);
    return response.data;
};
