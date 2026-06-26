import { Route, Routes } from 'react-router-dom';

import { CreateProject } from '../pages/CreateProject';
import { ProjectPlayground } from '../pages/ProjectPlayground';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CreateProject />} />
            <Route path="/project/:projectId" element={<ProjectPlayground />} />
        </Routes>
    );
};
