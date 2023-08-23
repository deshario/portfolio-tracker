import { Row, Col, Spin } from 'antd'

export const Loader = () => {
  return (
    <Row justify='center' align='middle' style={{ height: '100%' }}>
      <Col>
        <Spin tip='Loading' size='large' />
      </Col>
    </Row>
  )
}
