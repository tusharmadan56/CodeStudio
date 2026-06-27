import { create } from 'zustand';

export const useEditorStore = create((set) => ({
    openFiles: [],
    activeFile: null,

    setActiveFile: (file) => set({ activeFile: file }),

    openFile: (file) =>
        set((state) => {
            const alreadyOpen = state.openFiles.some((f) => f.path === file.path);
            if (alreadyOpen) {
                return { activeFile: file };
            }
            return { openFiles: [...state.openFiles, file], activeFile: file };
        }),

    closeFile: (path) =>
        set((state) => {
            const openFiles = state.openFiles.filter((f) => f.path !== path);
            const closingActive = state.activeFile?.path === path;
            return {
                openFiles,
                activeFile: closingActive ? openFiles.at(-1) ?? null : state.activeFile,
            };
        }),
}));
