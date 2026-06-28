import { useState } from 'react';
import { VscChevronDown, VscChevronRight, VscFile } from 'react-icons/vsc';

import { useEditorStore } from '../../../store/editorStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';

export const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const openFile = useEditorStore((state) => state.openFile);
    const activeFile = useEditorStore((state) => state.activeFile);
    const editorSocket = useEditorSocketStore((state) => state.editorSocket);

    const isFolder = Array.isArray(node.children);

    const handleClick = () => {
        if (isFolder) {
            setExpanded((prev) => !prev);
            return;
        }
        openFile({
            path: node.path,
            name: node.name,
            extension: node.name.split('.').pop(),
        });
        editorSocket?.emit('readFile', { pathToFileOrFolder: node.path });
    };

    const isActiveFile = !isFolder && activeFile?.path === node.path;

    return (
        <div className="tree-node">
            <div
                className={`tree-node__label ${isActiveFile ? 'tree-node__label--active' : ''}`}
                onClick={handleClick}
            >
                {isFolder ? (
                    expanded ? <VscChevronDown /> : <VscChevronRight />
                ) : (
                    <VscFile />
                )}
                <span>{node.name}</span>
            </div>

            {isFolder && expanded && (
                <div className="tree-node__children">
                    {node.children.map((child) => (
                        <TreeNode key={child.path} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};
