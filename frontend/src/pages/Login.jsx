import { Button, Form, Input, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import { useLogin } from '../hooks/apis/useLogin';
import { AuthShell } from '../components/auth/AuthShell';

export const Login = () => {
    const { mutate: login, isPending, error } = useLogin();
    const location = useLocation();

    return (
        <AuthShell command="login">
            {error && (
                <Typography.Paragraph style={{ color: '#ff5555', fontSize: 12 }}>
                    error: {(error.response?.data?.message ?? 'login failed').toLowerCase()}
                </Typography.Paragraph>
            )}
            <Form layout="vertical" requiredMark={false} onFinish={(values) => login(values)}>
                <Form.Item
                    name="email"
                    label="email"
                    rules={[{ required: true, type: 'email', message: 'enter a valid email' }]}
                >
                    <Input autoComplete="email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="password"
                    rules={[{ required: true, message: 'enter your password' }]}
                >
                    <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={isPending}>
                    log in
                </Button>
            </Form>
            <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 16, marginBottom: 0, fontSize: 12 }}
            >
                no account?{' '}
                <Link to="/signup" state={location.state}>
                    sign up
                </Link>
            </Typography.Paragraph>
        </AuthShell>
    );
};
