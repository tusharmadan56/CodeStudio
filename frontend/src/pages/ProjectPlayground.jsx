import { useParams } from 'react-router-dom';

export const ProjectPlayground = () => {
    const { projectId } = useParams();

    return <div>Project Playground: {projectId}</div>;
};
