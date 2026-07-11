import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { Button, Flex, Typography } from 'antd';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { useEditorStore } from '../store/editorStore';
import { useEditorSocketStore } from '../store/editorSocketStore';
import { useAuthStore } from '../store/authStore';
import { useMyProjects } from '../hooks/apis/useMyProjects';
import { ShareModal } from '../components/molecules/ShareModal/ShareModal';
import { FileTree } from '../components/organisms/FileTree/FileTree';
import { EditorTabs } from '../components/organisms/EditorTabs/EditorTabs';
import { EditorComponent } from '../components/molecules/Editor/Editor';
import { BrowserTerminal } from '../components/molecules/Terminal/BrowserTerminal';
import { Preview } from '../components/molecules/Preview/Preview';
import { getEditorLanguage } from '../utils/getEditorLanguage';

export const ProjectPlayground = () => {
    const { projectId } = useParams();
    const activeFile = useEditorStore((state) => state.activeFile);
    const openFiles = useEditorStore((state) => state.openFiles);
    const language = activeFile ? getEditorLanguage(activeFile.extension) : 'javascript';

    const setEditorSocket = useEditorSocketStore((state) => state.setEditorSocket);
    const editorSocket = useEditorSocketStore((state) => state.editorSocket);
    const setFileContent = useEditorStore((state) => state.setFileContent);
    const closeFilesUnder = useEditorStore((state) => state.closeFilesUnder);
    const queryClient = useQueryClient();

    const navigate = useNavigate();
    const { data: myProjects } = useMyProjects();
    const currentProject = myProjects?.data?.find((project) => project.id === projectId);
    const isOwner = currentProject?.role === 'owner';
    const [isShareOpen, setIsShareOpen] = useState(false);

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

    const editorValue = activeFile?.value ?? '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header
                style={{
                    height: 40,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 16px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-panel)',
                    flexShrink: 0,
                }}
            >
                <Typography.Text style={{ fontSize: 13 }}>
                    <span
                        style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                        onClick={() => navigate('/')}
                    >
                        <span style={{ color: 'var(--accent)' }}>~</span>/codestudio
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}> / </span>
                    {currentProject?.name ?? 'project'}
                </Typography.Text>
                {isOwner && (
                    <Button size="small" onClick={() => setIsShareOpen(true)}>
                        share
                    </Button>
                )}
            </header>

            <Group orientation="horizontal" style={{ flex: 1, minHeight: 0 }}>
                <Panel defaultSize="250px" minSize="160px" maxSize="45%">
                    <aside
                        style={{
                            height: '100%',
                            background: 'var(--bg-panel)',
                            overflowY: 'auto',
                        }}
                    >
                        <FileTree projectId={projectId} />
                    </aside>
                </Panel>
                <Separator style={{ width: 2 }} />

                <Panel minSize="20%">
                    <Group orientation="vertical" style={{ height: '100%' }}>
                        <Panel defaultSize="70%" minSize="15%">
                            {openFiles.length > 0 ? (
                                <div
                                    style={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: 0,
                                    }}
                                >
                                    <EditorTabs />
                                    <div style={{ flex: 1, minHeight: 0 }}>
                                        <EditorComponent
                                            language={language}
                                            value={editorValue}
                                            onChange={handleEditorChange}
                                            height="100%"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Flex
                                    vertical
                                    justify="center"
                                    align="center"
                                    gap={8}
                                    style={{ height: '100%' }}
                                >
                                    <Typography.Text strong style={{ fontSize: 18 }}>
                                        <span style={{ color: 'var(--accent)' }}>~</span>
                                        /codestudio
                                    </Typography.Text>
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        select a file from the tree to start editing
                                    </Typography.Text>
                                </Flex>
                            )}
                        </Panel>
                        <Separator style={{ height: 2 }} />
                        <Panel defaultSize="30%" minSize="10%">
                            <BrowserTerminal />
                        </Panel>
                    </Group>
                </Panel>
                <Separator style={{ width: 2 }} />

                <Panel defaultSize="35%" minSize="15%">
                    <Preview />
                </Panel>
            </Group>

            <ShareModal
                projectId={projectId}
                open={isShareOpen}
                onClose={() => setIsShareOpen(false)}
            />
        </div>
    );
};
