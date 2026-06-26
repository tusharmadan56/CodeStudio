import { Button, Col, Row } from 'antd';

import { useCreateProject } from '../hooks/apis/useCreateProject';

export const CreateProject = () => {
    const { mutate: createProject, isPending } = useCreateProject();

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
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
    );
};
