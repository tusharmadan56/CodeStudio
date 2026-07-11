import { useProjectTree } from '../../../hooks/apis/useProjectTree';
import { TreeNode } from './TreeNode';
import { ContextMenu } from '../../molecules/ContextMenu/ContextMenu';
import './FileTree.css';

export const FileTree = ({ projectId }) => {
    const { data, isLoading, isError } = useProjectTree(projectId);

    if (isLoading) {
        return <div className="file-tree__status">loading files...</div>;
    }

    if (isError) {
        return <div className="file-tree__status">failed to load files</div>;
    }

    const tree = data?.data;
    if (!tree) {
        return null;
    }

    return (
        <div className="file-tree">
            <TreeNode node={tree} />
            <ContextMenu />
        </div>
    );
};
