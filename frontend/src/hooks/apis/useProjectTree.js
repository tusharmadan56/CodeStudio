import { useQuery } from '@tanstack/react-query';

import { getProjectTreeApi } from '../../apis/getProjectTreeApi';

export const useProjectTree = (projectId) => {
    return useQuery({
        queryKey: ['projectTree', projectId],
        queryFn: () => getProjectTreeApi(projectId),
        enabled: Boolean(projectId),
    });
};
