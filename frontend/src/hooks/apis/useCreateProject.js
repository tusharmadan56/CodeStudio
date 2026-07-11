import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createProjectApi } from '../../apis/createProjectApi';

export const useCreateProject = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProjectApi,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['myProjects'] });
            navigate(`/project/${response.data}`);
        },
        onError: (error) => {
            console.error('Failed to create project', error);
        },
    });
};
