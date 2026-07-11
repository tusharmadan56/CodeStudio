import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Form, Input, Modal, Spin, Typography } from 'antd';

import { useCreateProject } from '../hooks/apis/useCreateProject';
import { useMyProjects } from '../hooks/apis/useMyProjects';
import { useLogout } from '../hooks/apis/useLogout';
import { useAuthStore } from '../store/authStore';

const isoDate = (value) => new Date(value).toISOString().slice(0, 10);

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    marginTop: -1,
    cursor: 'pointer',
    background: 'transparent',
};

export const Dashboard = () => {
    const { mutate: createProject, isPending } = useCreateProject();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { data: projects, isLoading } = useMyProjects();
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);

    const projectList = projects?.data ?? [];

    return (
        <>
            <Flex
                justify="space-between"
                align="center"
                style={{
                    padding: '10px 24px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-panel)',
                }}
            >
                <Typography.Text strong style={{ fontSize: 14 }}>
                    <span style={{ color: 'var(--accent)' }}>~</span>/codestudio
                </Typography.Text>
                <Flex align="center" gap="middle">
                    {user && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {user.email}
                        </Typography.Text>
                    )}
                    <Button size="small" onClick={() => logout()} loading={isLoggingOut}>
                        log out
                    </Button>
                </Flex>
            </Flex>

            <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
                    <Typography.Text strong style={{ fontSize: 16 }}>
                        your projects{' '}
                        <Typography.Text type="secondary">({projectList.length})</Typography.Text>
                    </Typography.Text>
                    <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                        + new project
                    </Button>
                </Flex>

                {isLoading ? (
                    <Flex justify="center" style={{ padding: 48 }}>
                        <Spin size="large" />
                    </Flex>
                ) : projectList.length === 0 ? (
                    <div
                        style={{
                            border: '1px dashed var(--border)',
                            padding: '40px 16px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography.Text type="secondary">
                            no projects yet — create one to get a live react sandbox
                        </Typography.Text>
                    </div>
                ) : (
                    <div>
                        {projectList.map((project) => (
                            <div
                                key={project.id}
                                style={{
                                    ...rowStyle,
                                    background:
                                        hoveredId === project.id
                                            ? 'var(--bg-panel)'
                                            : 'transparent',
                                }}
                                onMouseEnter={() => setHoveredId(project.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => navigate(`/project/${project.id}`)}
                            >
                                <Typography.Text
                                    strong
                                    style={{
                                        color:
                                            hoveredId === project.id
                                                ? 'var(--accent)'
                                                : 'var(--text)',
                                    }}
                                >
                                    {project.name}
                                </Typography.Text>
                                <Flex align="center" gap="middle">
                                    {project.role === 'member' && (
                                        <span
                                            style={{
                                                border: '1px solid var(--accent)',
                                                color: 'var(--accent)',
                                                padding: '0 6px',
                                                fontSize: 11,
                                            }}
                                        >
                                            shared
                                        </span>
                                    )}
                                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                        {isoDate(project.createdAt)}
                                    </Typography.Text>
                                </Flex>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                title="new project"
                open={isCreateOpen}
                onCancel={() => !isPending && setIsCreateOpen(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={({ name }) => createProject({ name })}>
                    <Form.Item
                        name="name"
                        label="project name"
                        rules={[
                            { required: true, whitespace: true, message: 'give your project a name' },
                        ]}
                    >
                        <Input placeholder="my-react-app" autoFocus maxLength={50} />
                    </Form.Item>
                    <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
                        scaffolds a fresh vite + react app — can take up to a minute
                    </Typography.Paragraph>
                    <Button type="primary" htmlType="submit" block loading={isPending}>
                        create
                    </Button>
                </Form>
            </Modal>
        </>
    );
};
