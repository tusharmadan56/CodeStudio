import { Route, Routes } from 'react-router-dom';

import { CreateProject } from '../pages/CreateProject';
import { ProjectPlayground } from '../pages/ProjectPlayground';
import { JoinProject } from '../pages/JoinProject';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <CreateProject />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/project/:projectId"
                element={
                    <ProtectedRoute>
                        <ProjectPlayground />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/join/:token"
                element={
                    <ProtectedRoute>
                        <JoinProject />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};
