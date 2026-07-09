import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';

import { useEditorStore } from '../store/editorStore';
import { useEditorSocketStore } from '../store/editorSocketStore';
import { useAuthStore } from '../store/authStore';
import { FileTree } from '../components/organisms/FileTree/FileTree';
import { EditorTabs } from '../components/organisms/EditorTabs/EditorTabs';
import { EditorComponent } from '../components/molecules/Editor/Editor';
import { BrowserTerminal } from '../components/molecules/Terminal/BrowserTerminal';
import { Preview } from '../components/molecules/Preview/Preview';
import { getEditorLanguage } from '../utils/getEditorLanguage';

export const ProjectPlayground = () => {
    const { projectId } = useParams();
    const activeFile = useEditorStore((state) => state.activeFile);
    const language = activeFile ? getEditorLanguage(activeFile.extension) : 'javascript';

    const setEditorSocket = useEditorSocketStore((state) => state.setEditorSocket);
    const editorSocket = useEditorSocketStore((state) => state.editorSocket);
    const setFileContent = useEditorStore((state) => state.setFileContent);
    const closeFilesUnder = useEditorStore((state) => state.closeFilesUnder);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!projectId) return;

        const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
            query: { projectId },
            // read at connect time, not as a hook dep — a token refresh shouldn't tear down the socket
            auth: { token: useAuthStore.getState().accessToken },
        });
        setEditorSocket(editorSocketConnection);

        return () => {
            editorSocketConnection.disconnect();
        };
    }, [projectId, setEditorSocket]);

    useEffect(() => {
        if (!editorSocket) return;

        const handleReadFileSuccess = (data) => setFileContent(data.path, data.value);
        // another client edited a file we may have open — update it live
        const handleWriteFileSuccess = (data) => {
            if (data?.path) setFileContent(data.path, data.value);
        };
        // any structural change to the project refreshes the file tree
        const refreshTree = () =>
            queryClient.invalidateQueries({ queryKey: ['projectTree', projectId] });
        // a deleted file/folder must also drop any open tabs pointing into it
        const handleDeleteSuccess = (data) => {
            if (data?.path) closeFilesUnder(data.path);
            refreshTree();
        };

        editorSocket.on('readFileSuccess', handleReadFileSuccess);
        editorSocket.on('writeFileSuccess', handleWriteFileSuccess);
        editorSocket.on('createFileSuccess', refreshTree);
        editorSocket.on('deleteFileSuccess', handleDeleteSuccess);
        editorSocket.on('createFolderSuccess', refreshTree);
        editorSocket.on('deleteFolderSuccess', handleDeleteSuccess);

        return () => {
            editorSocket.off('readFileSuccess', handleReadFileSuccess);
            editorSocket.off('writeFileSuccess', handleWriteFileSuccess);
            editorSocket.off('createFileSuccess', refreshTree);
            editorSocket.off('deleteFileSuccess', handleDeleteSuccess);
            editorSocket.off('createFolderSuccess', refreshTree);
            editorSocket.off('deleteFolderSuccess', handleDeleteSuccess);
        };
    }, [editorSocket, setFileContent, closeFilesUnder, queryClient, projectId]);

    const saveTimerRef = useRef(null);

    //  keep the in-memory value live on every keystroke, but only
    // hit the disk once typing pauses to avoid a write per character.
    const handleEditorChange = (value) => {
        if (!activeFile) return;
        setFileContent(activeFile.path, value);

        if (!editorSocket) return;
        const pathToFileOrFolder = activeFile.path;
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            editorSocket.emit('writeFile', { pathToFileOrFolder, data: value });
        }, 1000);
    };

    const editorValue = activeFile ? activeFile.value ?? '' : '// Open a file to start editing';

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: 250, background: '#21222c', overflowY: 'auto', flexShrink: 0 }}>
                <FileTree projectId={projectId} />
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EditorTabs />
                <EditorComponent
                    language={language}
                    value={editorValue}
                    onChange={handleEditorChange}
                    height="calc(70vh - 38px)"
                />
                <div style={{ height: '30vh', borderTop: '1px solid #44475a' }}>
                    <BrowserTerminal />
                </div>
            </main>

            <aside style={{ width: '40%', borderLeft: '1px solid #44475a', flexShrink: 0 }}>
                <Preview />
            </aside>
        </div>
    );
};
