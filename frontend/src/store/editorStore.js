import { create } from 'zustand';

export const useEditorStore = create((set) => ({
    // TODO(phase6): seed is temporary so tabs are visible now; the directory
    // tree will populate openFiles by opening files on click.
    openFiles: [
        { path: '/demo/App.jsx', name: 'App.jsx', extension: 'jsx' },
        { path: '/demo/index.css', name: 'index.css', extension: 'css' },
    ],
    activeFile: { path: '/demo/App.jsx', name: 'App.jsx', extension: 'jsx' },

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
