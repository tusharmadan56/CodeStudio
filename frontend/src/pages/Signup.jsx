import { Alert, Button, Card, Form, Input, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { useSignup } from '../hooks/apis/useSignup';

export const Signup = () => {
    const { mutate: signup, isPending, error } = useSignup();

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Card style={{ width: 380 }}>
                <Typography.Title level={3}>Create account</Typography.Title>
                {error && (
                    <Alert
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message={error.response?.data?.message ?? 'Signup failed'}
                    />
                )}
                <Form layout="vertical" onFinish={(values) => signup(values)}>
                    <Form.Item name="name" label="Name">
                        <Input autoComplete="name" />
                    </Form.Item>
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
                        rules={[{ required: true, min: 8, message: 'At least 8 characters' }]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isPending}>
                        Sign up
                    </Button>
                </Form>
                <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
                    Already have an account? <Link to="/login">Log in</Link>
                </Typography.Paragraph>
            </Card>
        </Row>
    );
};
