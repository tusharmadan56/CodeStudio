import { VscClose } from 'react-icons/vsc';

import { EditorButton } from '../../atoms/EditorButton/EditorButton';
import './EditorTab.css';

export const EditorTab = ({ file, isActive, onSelect, onClose }) => {
    return (
        <div className={`editor-tab ${isActive ? 'editor-tab--active' : ''}`}>
            <EditorButton isActive={isActive} onClick={() => onSelect(file)}>
                {file.name}
            </EditorButton>

            <button
                className="editor-tab__close"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(file.path);
                }}
            >
                <VscClose />
            </button>
        </div>
    );
};
