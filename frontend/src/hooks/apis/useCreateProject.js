import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createProjectApi } from '../../apis/createProjectApi';

export const useCreateProject = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createProjectApi,
        onSuccess: (response) => {
            navigate(`/project/${response.data}`);
        },
        onError: (error) => {
            console.error('Failed to create project', error);
        },
    });
};
