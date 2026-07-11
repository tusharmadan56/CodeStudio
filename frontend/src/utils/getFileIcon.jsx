import { SiCss, SiGit, SiHtml5, SiJavascript, SiNpm, SiReact, SiVite } from 'react-icons/si';
import { VscFile, VscFileMedia, VscJson, VscMarkdown } from 'react-icons/vsc';

const byName = {
    'package.json': { Icon: SiNpm, color: '#ff5555' },
    'package-lock.json': { Icon: SiNpm, color: '#6272a4' },
    '.gitignore': { Icon: SiGit, color: '#ffb86c' },
    'vite.config.js': { Icon: SiVite, color: '#bd93f9' },
};

const byExtension = {
    js: { Icon: SiJavascript, color: '#f1fa8c' },
    mjs: { Icon: SiJavascript, color: '#f1fa8c' },
    cjs: { Icon: SiJavascript, color: '#f1fa8c' },
    jsx: { Icon: SiReact, color: '#8be9fd' },
    css: { Icon: SiCss, color: '#bd93f9' },
    html: { Icon: SiHtml5, color: '#ffb86c' },
    json: { Icon: VscJson, color: '#f1fa8c' },
    md: { Icon: VscMarkdown, color: '#6272a4' },
    svg: { Icon: VscFileMedia, color: '#ff79c6' },
    png: { Icon: VscFileMedia, color: '#ff79c6' },
    jpg: { Icon: VscFileMedia, color: '#ff79c6' },
    jpeg: { Icon: VscFileMedia, color: '#ff79c6' },
    gif: { Icon: VscFileMedia, color: '#ff79c6' },
    ico: { Icon: VscFileMedia, color: '#ff79c6' },
};

export const FileIcon = ({ name }) => {
    const extension = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    const { Icon, color } = byName[name] ?? byExtension[extension] ?? { Icon: VscFile, color: '#6272a4' };
    return <Icon size={13} style={{ color, flexShrink: 0 }} />;
};
