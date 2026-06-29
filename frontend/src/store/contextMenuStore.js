import { create } from 'zustand';

export const useContextMenuStore = create((set) => ({
    isOpen: false,
    x: 0,
    y: 0,
    target: null, // { path, type: 'file' | 'folder' }

    open: (x, y, target) => set({ isOpen: true, x, y, target }),
    close: () => set({ isOpen: false, target: null }),
}));
