import { Flex, Typography } from 'antd';

export const AuthShell = ({ command, children }) => (
    <Flex justify="center" align="center" style={{ minHeight: '100vh', padding: 16 }}>
        <div
            style={{
                width: 360,
                maxWidth: '100%',
                border: '1px solid var(--border)',
                background: 'var(--bg-panel)',
                padding: 32,
            }}
        >
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                <span style={{ color: 'var(--accent)' }}>~</span>/codestudio
            </Typography.Text>
            <Typography.Title level={4} style={{ margin: '8px 0 24px' }}>
                <span style={{ color: 'var(--accent)' }}>$</span> {command}
            </Typography.Title>
            {children}
        </div>
    </Flex>
);
