import { useContextMenuStore } from '../../../store/contextMenuStore';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import './ContextMenu.css';

export const ContextMenu = () => {
    const { isOpen, x, y, target, close } = useContextMenuStore();
    const editorSocket = useEditorSocketStore((state) => state.editorSocket);

    if (!isOpen || !target) return null;

    const emit = (event, path) => {
        editorSocket?.emit(event, { pathToFileOrFolder: path });
        close();
    };

    // For create actions the target folder is the parent of the new entry.
    const createUnder = (event) => {
        const name = window.prompt('Name?');
        if (name) emit(event, `${target.path}/${name}`);
        else close();
    };

    return (
        <div
            className="context-menu"
            style={{ top: y, left: x }}
            onMouseLeave={close}
        >
            {target.type === 'folder' && (
                <>
                    <button className="context-menu__item" onClick={() => createUnder('createFile')}>
                        New File
                    </button>
                    <button className="context-menu__item" onClick={() => createUnder('createFolder')}>
                        New Folder
                    </button>
                    <button className="context-menu__item" onClick={() => emit('deleteFolder', target.path)}>
                        Delete Folder
                    </button>
                </>
            )}

            {target.type === 'file' && (
                <button className="context-menu__item" onClick={() => emit('deleteFile', target.path)}>
                    Delete File
                </button>
            )}
        </div>
    );
};
