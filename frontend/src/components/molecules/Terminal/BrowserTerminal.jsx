import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';
import './BrowserTerminal.css';
import { usePreviewStore } from '../../../store/previewStore';
import { useAuthStore } from '../../../store/authStore';

export const BrowserTerminal = () => {
    const { projectId } = useParams();
    const terminalRef = useRef(null);
    const socketRef = useRef(null);
    const setPreviewUrl = usePreviewStore((state) => state.setUrl);

    useEffect(() => {
        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            convertEol: true,
            theme: { background: '#21222c', foreground: '#f8f8f2' },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        const socket = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
            query: { projectId },
            auth: { token: useAuthStore.getState().accessToken },
        });
        socketRef.current = socket;

        // backend → terminal
        socket.on('shell:output', (data) => term.write(data));
        // backend tells us which host port the container's dev server is mapped to
        socket.on('preview:url', (data) => setPreviewUrl(data.url));
        // terminal → backend
        term.onData((data) => socket.emit('shell:input', data));

        return () => {
            socket.disconnect();
            term.dispose();
        };
    }, [projectId, setPreviewUrl]);

    return <div className="terminal" ref={terminalRef} />;
};
