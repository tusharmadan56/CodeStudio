import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { joinProjectApi } from '../../apis/shareApi';

export const useJoinProject = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: joinProjectApi,
        onSuccess: ({ projectId }) => {
            navigate(`/project/${projectId}`, { replace: true });
        },
    });
};
