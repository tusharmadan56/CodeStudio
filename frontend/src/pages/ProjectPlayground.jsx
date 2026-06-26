import { useParams } from 'react-router-dom';

import { EditorComponent } from '../components/molecules/Editor/Editor';

export const ProjectPlayground = () => {
    const { projectId } = useParams();

    return (
        <div style={{ height: '100vh' }}>
            <EditorComponent />
        </div>
    );
};
