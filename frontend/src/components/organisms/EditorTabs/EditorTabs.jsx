import { useEditorStore } from '../../../store/editorStore';
import { EditorTab } from '../../molecules/EditorTab/EditorTab';
import './EditorTabs.css';

export const EditorTabs = () => {
    const openFiles = useEditorStore((state) => state.openFiles);
    const activeFile = useEditorStore((state) => state.activeFile);
    const setActiveFile = useEditorStore((state) => state.setActiveFile);
    const closeFile = useEditorStore((state) => state.closeFile);

    if (openFiles.length === 0) {
        return null;
    }

    return (
        <div className="editor-tabs">
            {openFiles.map((file) => (
                <EditorTab
                    key={file.path}
                    file={file}
                    isActive={activeFile?.path === file.path}
                    onSelect={setActiveFile}
                    onClose={closeFile}
                />
            ))}
        </div>
    );
};
