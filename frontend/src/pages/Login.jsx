import { Alert, Button, Card, Form, Input, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { useLogin } from '../hooks/apis/useLogin';

export const Login = () => {
    const { mutate: login, isPending, error } = useLogin();

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Card style={{ width: 380 }}>
                <Typography.Title level={3}>Log in</Typography.Title>
                {error && (
                    <Alert
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message={error.response?.data?.message ?? 'Login failed'}
                    />
                )}
                <Form layout="vertical" onFinish={(values) => login(values)}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
                    >
                        <Input autoComplete="email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Enter your password' }]}
                    >
                        <Input.Password autoComplete="current-password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isPending}>
                        Log in
                    </Button>
                </Form>
                <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
                    No account? <Link to="/signup">Sign up</Link>
                </Typography.Paragraph>
            </Card>
        </Row>
    );
};
