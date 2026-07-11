import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Typography } from 'antd';

import { useJoinProject } from '../hooks/apis/useJoinProject';
import { AuthShell } from '../components/auth/AuthShell';

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
        <AuthShell command="join">
            {error ? (
                <>
                    <Typography.Paragraph style={{ color: '#ff5555', fontSize: 12 }}>
                        error:{' '}
                        {(error.response?.data?.message ?? 'failed to join project').toLowerCase()}
                    </Typography.Paragraph>
                    <Link to="/">
                        <Button type="primary" block>
                            back to your projects
                        </Button>
                    </Link>
                </>
            ) : (
                <Typography.Text type="secondary">
                    joining project<span className="blink">▌</span>
                </Typography.Text>
            )}
        </AuthShell>
    );
};
