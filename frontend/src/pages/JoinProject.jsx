import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button, Flex, Spin } from 'antd';

import { useJoinProject } from '../hooks/apis/useJoinProject';

export const JoinProject = () => {
    const { token } = useParams();
    const { mutate: join, error } = useJoinProject();
    const firedRef = useRef(false);

    useEffect(() => {
        if (firedRef.current) return;
        firedRef.current = true;
        join(token);
    }, [join, token]);

    return (
        <Flex vertical justify="center" align="center" gap="large" style={{ minHeight: '100vh' }}>
            {error ? (
                <>
                    <Alert
                        type="error"
                        showIcon
                        message={error.response?.data?.message ?? 'Failed to join project'}
                    />
                    <Link to="/">
                        <Button type="primary">Back to your projects</Button>
                    </Link>
                </>
            ) : (
                <Spin size="large" tip="Joining project...">
                    <div style={{ width: 200 }} />
                </Spin>
            )}
        </Flex>
    );
};
