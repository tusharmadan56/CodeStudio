import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { io } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';
import './BrowserTerminal.css';

export const BrowserTerminal = () => {
    const { projectId } = useParams();
    const terminalRef = useRef(null);
    const socketRef = useRef(null);

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
        });
        socketRef.current = socket;

        // backend → terminal
        socket.on('shell:output', (data) => term.write(data));
        // terminal → backend
        term.onData((data) => socket.emit('shell:input', data));

        return () => {
            socket.disconnect();
            term.dispose();
        };
    }, [projectId]);

    return <div className="terminal" ref={terminalRef} />;
};
