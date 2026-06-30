import { useState } from 'react';
import { usePreviewStore } from '../../../store/previewStore';
import './Preview.css';

export const Preview = () => {
    const url = usePreviewStore((state) => state.url);
    const [refreshKey, setRefreshKey] = useState(0);

    if (!url) {
        return (
            <div className="preview preview--empty">
                Run <code>npm install &amp;&amp; npm run dev</code> in the terminal to preview your app.
            </div>
        );
    }

    return (
        <div className="preview">
            <div className="preview__bar">
                <button className="preview__refresh" onClick={() => setRefreshKey((k) => k + 1)}>
                    ↻
                </button>
                <span className="preview__url">{url}</span>
            </div>
            <iframe key={refreshKey} className="preview__frame" src={url} title="preview" />
        </div>
    );
};
