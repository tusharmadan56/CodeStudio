import { Button, Form, Input, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import { useSignup } from '../hooks/apis/useSignup';
import { AuthShell } from '../components/auth/AuthShell';

export const Signup = () => {
    const { mutate: signup, isPending, error } = useSignup();
    const location = useLocation();

    return (
        <AuthShell command="signup">
            {error && (
                <Typography.Paragraph style={{ color: '#ff5555', fontSize: 12 }}>
                    error: {(error.response?.data?.message ?? 'signup failed').toLowerCase()}
                </Typography.Paragraph>
            )}
            <Form layout="vertical" requiredMark={false} onFinish={(values) => signup(values)}>
                <Form.Item name="name" label="name">
                    <Input autoComplete="name" />
                </Form.Item>
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
                    rules={[{ required: true, min: 8, message: 'at least 8 characters' }]}
                >
                    <Input.Password autoComplete="new-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block loading={isPending}>
                    sign up
                </Button>
            </Form>
            <Typography.Paragraph
                type="secondary"
                style={{ marginTop: 16, marginBottom: 0, fontSize: 12 }}
            >
                already have an account?{' '}
                <Link to="/login" state={location.state}>
                    log in
                </Link>
            </Typography.Paragraph>
        </AuthShell>
    );
};
