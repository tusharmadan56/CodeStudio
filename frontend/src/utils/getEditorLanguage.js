const EXTENSION_TO_LANGUAGE = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    css: 'css',
    md: 'markdown',
    svg: 'xml',
};

export const getEditorLanguage = (extension) =>
    EXTENSION_TO_LANGUAGE[extension] || 'plaintext';
