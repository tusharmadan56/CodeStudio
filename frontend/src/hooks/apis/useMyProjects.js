import { useQuery } from '@tanstack/react-query';

import { getMyProjectsApi } from '../../apis/getMyProjectsApi';

export const useMyProjects = () => {
    return useQuery({
        queryKey: ['myProjects'],
        queryFn: getMyProjectsApi,
    });
};
