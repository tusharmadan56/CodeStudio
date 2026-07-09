import { Button, Col, Flex, List, Row, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useCreateProject } from '../hooks/apis/useCreateProject';
import { useMyProjects } from '../hooks/apis/useMyProjects';
import { useLogout } from '../hooks/apis/useLogout';
import { useAuthStore } from '../store/authStore';

export const CreateProject = () => {
    const { mutate: createProject, isPending } = useCreateProject();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { data: projects, isLoading } = useMyProjects();
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    return (
        <>
            <Flex justify="flex-end" align="center" gap="middle" style={{ padding: 16 }}>
                {user && <Typography.Text type="secondary">{user.email}</Typography.Text>}
                <Button onClick={() => logout()} loading={isLoggingOut}>
                    Log out
                </Button>
            </Flex>
            <Row justify="center" style={{ paddingTop: '10vh' }}>
                <Col xs={22} sm={16} md={12} lg={8}>
                    <Flex vertical gap="large">
                        <Button
                            type="primary"
                            size="large"
                            loading={isPending}
                            onClick={() => createProject()}
                        >
                            Create Playground
                        </Button>
                        <List
                            header={<Typography.Text strong>Your projects</Typography.Text>}
                            bordered
                            loading={isLoading}
                            dataSource={projects?.data ?? []}
                            locale={{ emptyText: 'No projects yet' }}
                            renderItem={(project) => (
                                <List.Item
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/project/${project.id}`)}
                                >
                                    <List.Item.Meta
                                        title={project.name}
                                        description={new Date(project.createdAt).toLocaleString()}
                                    />
                                    {project.role === 'member' && <Tag color="blue">shared</Tag>}
                                </List.Item>
                            )}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    );
};
