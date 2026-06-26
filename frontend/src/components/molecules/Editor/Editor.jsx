import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

export const EditorComponent = ({
    height = '80vh',
    width = '100%',
    defaultLanguage = 'javascript',
    defaultValue = '// Start coding...',
    fontFamily = 'JetBrains Mono, monospace',
    fontSize = 14,
}) => {
    const [theme, setTheme] = useState(null);
    const monacoRef = useRef(null);

    useEffect(() => {
        fetch('/dracula.json')
            .then((res) => res.json())
            .then(setTheme);
    }, []);

    // Theme and editor can become ready in either order, so apply whenever both exist.
    useEffect(() => {
        if (monacoRef.current && theme) {
            applyTheme(monacoRef.current, theme);
        }
    }, [theme]);

    const applyTheme = (monaco, themeData) => {
        monaco.editor.defineTheme('dracula', themeData);
        monaco.editor.setTheme('dracula');
    };

    const handleEditorMount = (editor, monaco) => {
        monacoRef.current = monaco;
        if (theme) {
            applyTheme(monaco, theme);
        }
    };

    return (
        <Editor
            height={height}
            width={width}
            defaultLanguage={defaultLanguage}
            defaultValue={defaultValue}
            onMount={handleEditorMount}
            options={{ fontFamily, fontSize, minimap: { enabled: true } }}
        />
    );
};
