import { useMutation } from '@tanstack/react-query';

import { createShareLinkApi, revokeShareLinkApi } from '../../apis/shareApi';

export const useCreateShareLink = (projectId) => {
    return useMutation({
        mutationFn: () => createShareLinkApi(projectId),
    });
};

export const useRevokeShareLink = (projectId, options) => {
    return useMutation({
        mutationFn: () => revokeShareLinkApi(projectId),
        ...options,
    });
};
