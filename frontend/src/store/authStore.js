import { create } from 'zustand';

// accessToken lives in memory only (never localStorage) so an XSS bug can't read it.
export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isBootstrapping: true,

    setAuth: ({ user, accessToken }) => set({ user, accessToken }),
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAuth: () => set({ user: null, accessToken: null }),
    finishBootstrap: () => set({ isBootstrapping: false }),
}));
