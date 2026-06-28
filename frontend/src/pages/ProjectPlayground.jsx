import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

import { useEditorStore } from '../store/editorStore';
import { useEditorSocketStore } from '../store/editorSocketStore';
import { FileTree } from '../components/organisms/FileTree/FileTree';
import { EditorTabs } from '../components/organisms/EditorTabs/EditorTabs';
import { EditorComponent } from '../components/molecules/Editor/Editor';
import { getEditorLanguage } from '../utils/getEditorLanguage';

export const ProjectPlayground = () => {
    const { projectId } = useParams();
    const activeFile = useEditorStore((state) => state.activeFile);
    const language = activeFile ? getEditorLanguage(activeFile.extension) : 'javascript';

    const setEditorSocket = useEditorSocketStore((state) => state.setEditorSocket);
    const editorSocket = useEditorSocketStore((state) => state.editorSocket);
    const setFileContent = useEditorStore((state) => state.setFileContent);

    useEffect(() => {
        if (!projectId) return;

        const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
            query: { projectId },
        });
        setEditorSocket(editorSocketConnection);

        return () => {
            editorSocketConnection.disconnect();
        };
    }, [projectId, setEditorSocket]);

    useEffect(() => {
        if (!editorSocket) return;

        const handleReadFileSuccess = (data) => setFileContent(data.path, data.value);
        editorSocket.on('readFileSuccess', handleReadFileSuccess);

        return () => editorSocket.off('readFileSuccess', handleReadFileSuccess);
    }, [editorSocket, setFileContent]);

    const editorValue = activeFile ? activeFile.value ?? '' : '// Open a file to start editing';

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: 250, background: '#21222c', overflowY: 'auto', flexShrink: 0 }}>
                <FileTree projectId={projectId} />
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EditorTabs />
                <EditorComponent language={language} value={editorValue} height="calc(100vh - 38px)" />
            </main>
        </div>
    );
};
