import { useEffect } from 'react';
import { Alert, Button, Flex, Modal, Spin, Typography } from 'antd';

import { useCreateShareLink, useRevokeShareLink } from '../../../hooks/apis/useShareLink';

export const ShareModal = ({ projectId, open, onClose }) => {
    const { mutate: createLink, data, error, isPending, reset } = useCreateShareLink(projectId);
    const { mutate: revokeLink, isPending: isRevoking } = useRevokeShareLink(projectId, {
        onSuccess: () => {
            reset();
            onClose();
        },
    });

    useEffect(() => {
        if (open) createLink();
    }, [open, createLink]);

    const shareUrl = data ? `${window.location.origin}/join/${data.token}` : null;

    return (
        <Modal title="Share project" open={open} onCancel={onClose} footer={null}>
            {isPending && <Spin />}
            {error && (
                <Alert
                    type="error"
                    showIcon
                    message={error.response?.data?.message ?? 'Failed to create share link'}
                />
            )}
            {shareUrl && (
                <Flex vertical gap="middle">
                    <Typography.Text type="secondary">
                        Anyone with this link can edit the project and use its terminal after
                        signing in.
                    </Typography.Text>
                    <Typography.Text code copyable={{ text: shareUrl }}>
                        {shareUrl}
                    </Typography.Text>
                    <Button danger loading={isRevoking} onClick={() => revokeLink()}>
                        Revoke link
                    </Button>
                </Flex>
            )}
        </Modal>
    );
};
