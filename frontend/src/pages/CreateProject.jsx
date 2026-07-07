import { Button, Col, Flex, Row, Typography } from 'antd';

import { useCreateProject } from '../hooks/apis/useCreateProject';
import { useLogout } from '../hooks/apis/useLogout';
import { useAuthStore } from '../store/authStore';

export const CreateProject = () => {
    const { mutate: createProject, isPending } = useCreateProject();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const user = useAuthStore((state) => state.user);

    return (
        <>
            <Flex justify="flex-end" align="center" gap="middle" style={{ padding: 16 }}>
                {user && <Typography.Text type="secondary">{user.email}</Typography.Text>}
                <Button onClick={() => logout()} loading={isLoggingOut}>
                    Log out
                </Button>
            </Flex>
            <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
                <Col>
                    <Button
                        type="primary"
                        size="large"
                        loading={isPending}
                        onClick={() => createProject()}
                    >
                        Create Playground
                    </Button>
                </Col>
            </Row>
        </>
    );
};
