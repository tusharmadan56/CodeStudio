import { useProjectTree } from '../../../hooks/apis/useProjectTree';
import { TreeNode } from './TreeNode';
import './FileTree.css';

export const FileTree = ({ projectId }) => {
    const { data, isLoading, isError } = useProjectTree(projectId);

    if (isLoading) {
        return <div className="file-tree__status">Loading files...</div>;
    }

    if (isError) {
        return <div className="file-tree__status">Failed to load files</div>;
    }

    const tree = data?.data;
    if (!tree) {
        return null;
    }

    return (
        <div className="file-tree">
            <TreeNode node={tree} />
        </div>
    );
};
