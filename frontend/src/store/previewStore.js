import { create } from 'zustand';

export const usePreviewStore = create((set) => ({
    url: null,
    setUrl: (url) => set({ url }),
}));
