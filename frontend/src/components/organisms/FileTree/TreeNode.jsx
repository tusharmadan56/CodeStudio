import { useState } from 'react';
import { VscChevronDown, VscChevronRight } from 'react-icons/vsc';

import { useEditorStore } from '../../../store/editorStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useContextMenuStore } from '../../../store/contextMenuStore';
import { FileIcon } from '../../../utils/getFileIcon';

export const TreeNode = ({ node }) => {
    const [expanded, setExpanded] = useState(false);
    const openFile = useEditorStore((state) => state.openFile);
    const activeFile = useEditorStore((state) => state.activeFile);
    const editorSocket = useEditorSocketStore((state) => state.editorSocket);
    const openContextMenu = useContextMenuStore((state) => state.open);

    const isFolder = Array.isArray(node.children);

    const handleContextMenu = (e) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY, {
            path: node.path,
            type: isFolder ? 'folder' : 'file',
        });
    };

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
                onContextMenu={handleContextMenu}
            >
                {isFolder ? (
                    expanded ? <VscChevronDown /> : <VscChevronRight />
                ) : (
                    <FileIcon name={node.name} />
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
