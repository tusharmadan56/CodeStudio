import { useEffect } from 'react';
import { Button, Flex, Modal, Spin, Typography } from 'antd';

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
        <Modal title="share project" open={open} onCancel={onClose} footer={null}>
            {isPending && <Spin />}
            {error && (
                <Typography.Paragraph style={{ color: '#ff5555', fontSize: 12 }}>
                    error:{' '}
                    {(error.response?.data?.message ?? 'failed to create share link').toLowerCase()}
                </Typography.Paragraph>
            )}
            {shareUrl && (
                <Flex vertical gap="middle">
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        anyone with this link can edit the project and use its terminal after
                        signing in
                    </Typography.Text>
                    <Typography.Text code copyable={{ text: shareUrl }}>
                        {shareUrl}
                    </Typography.Text>
                    <Button danger loading={isRevoking} onClick={() => revokeLink()}>
                        revoke link
                    </Button>
                </Flex>
            )}
        </Modal>
    );
};
