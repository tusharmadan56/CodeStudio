import { useEditorStore } from '../store/editorStore';
import { EditorTabs } from '../components/organisms/EditorTabs/EditorTabs';
import { EditorComponent } from '../components/molecules/Editor/Editor';
import { getEditorLanguage } from '../utils/getEditorLanguage';

export const ProjectPlayground = () => {
    const activeFile = useEditorStore((state) => state.activeFile);
    const language = activeFile ? getEditorLanguage(activeFile.extension) : 'javascript';

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <EditorTabs />
            <EditorComponent language={language} height="calc(100vh - 38px)" />
        </div>
    );
};
