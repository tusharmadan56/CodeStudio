import { useEffect } from 'react';
import { Spin } from 'antd';

import { refreshApi, meApi } from '../../apis/authApi';
import { useAuthStore } from '../../store/authStore';

// On load, try to restore a session from the refresh cookie (survives page reloads,
// since the access token only lives in memory). Renders nothing until that resolves.
export const AuthProvider = ({ children }) => {
    const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
    const setAuth = useAuthStore((state) => state.setAuth);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const finishBootstrap = useAuthStore((state) => state.finishBootstrap);

    useEffect(() => {
        (async () => {
            try {
                const { accessToken } = await refreshApi();
                setAccessToken(accessToken); // so the /me request carries it
                const { user } = await meApi();
                setAuth({ user, accessToken });
            } catch {
                // no valid session — stay logged out
            } finally {
                finishBootstrap();
            }
        })();
    }, [setAuth, setAccessToken, finishBootstrap]);

    if (isBootstrapping) {
        return (
            <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return children;
};
