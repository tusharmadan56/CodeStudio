import './EditorButton.css';

export const EditorButton = ({ children, onClick, isActive = false, className = '' }) => {
    return (
        <button
            className={`editor-button ${isActive ? 'editor-button--active' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
