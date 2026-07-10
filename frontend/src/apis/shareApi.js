import axiosInstance from '../config/axiosConfig';

export const createShareLinkApi = async (projectId) => {
    const { data } = await axiosInstance.post(`/projects/${projectId}/share`);
    return data.data;
};

export const revokeShareLinkApi = async (projectId) => {
    const { data } = await axiosInstance.delete(`/projects/${projectId}/share`);
    return data;
};

export const joinProjectApi = async (token) => {
    const { data } = await axiosInstance.post(`/shares/${token}/join`);
    return data.data;
};
