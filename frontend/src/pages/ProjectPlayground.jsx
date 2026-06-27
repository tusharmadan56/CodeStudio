import { useParams } from 'react-router-dom';

import { useEditorStore } from '../store/editorStore';
import { FileTree } from '../components/organisms/FileTree/FileTree';
import { EditorTabs } from '../components/organisms/EditorTabs/EditorTabs';
import { EditorComponent } from '../components/molecules/Editor/Editor';
import { getEditorLanguage } from '../utils/getEditorLanguage';

export const ProjectPlayground = () => {
    const { projectId } = useParams();
    const activeFile = useEditorStore((state) => state.activeFile);
    const language = activeFile ? getEditorLanguage(activeFile.extension) : 'javascript';

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: 250, background: '#21222c', overflowY: 'auto', flexShrink: 0 }}>
                <FileTree projectId={projectId} />
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <EditorTabs />
                <EditorComponent language={language} height="calc(100vh - 38px)" />
            </main>
        </div>
    );
};
