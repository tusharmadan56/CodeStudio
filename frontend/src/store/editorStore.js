import { create } from 'zustand';

export const useEditorStore = create((set) => ({
    openFiles: [],
    activeFile: null,

    setActiveFile: (file) => set({ activeFile: file }),

    openFile: (file) =>
        set((state) => {
            const existing = state.openFiles.find((f) => f.path === file.path);
            if (existing) {
                return { activeFile: existing };
            }
            return { openFiles: [...state.openFiles, file], activeFile: file };
        }),

    setFileContent: (path, value) =>
        set((state) => ({
            openFiles: state.openFiles.map((f) => (f.path === path ? { ...f, value } : f)),
            activeFile:
                state.activeFile?.path === path ? { ...state.activeFile, value } : state.activeFile,
        })),

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
