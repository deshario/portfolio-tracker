import { Row, Col, Card } from 'antd';
import styled from 'styled-components'

const AuthLayout: React.FC<{ bptUser: any }> = (props) => {

  const styles = {
    card: {
      maxHeight: '100%',
      border: 'unset',
      borderRadius:'6px',
      background:'transparent',
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
    },
    cardBody: {
      padding: 'unset'
    }
  };

  return (
    <AuthRoot>
      <Card style={styles.card} bodyStyle={styles.cardBody}>
        <Row>
          <Col span={12}>
            <LeftContainer>
              <img src="../images/report.gif"/>
            </LeftContainer>
          </Col>
          <ChildContainer span={12}>
            {props.children}
          </ChildContainer>
        </Row>
      </Card>
    </AuthRoot>
  )
}

export default AuthLayout

const AuthRoot = styled.div`
  height: 100vh;
  padding: 70px 200px;
  background: #764ba2;
  background: -webkit-linear-gradient(to right, rgb(128,126,223), #764ba2);
  background: linear-gradient(to right, rgb(128,126,223), #764ba2)
`

const LeftContainer = styled.div`
  padding:3em;
  background: rgb(128,126,223);
  width:100%;
  height:100%;
  > img{
    margin-top: 4em;
    width: 100%;
  }
`

const ChildContainer = styled(Col)`
  height:490px;
  background:white;
  border-top-right-radius:6px;
  border-bottom-right-radius:6px;
  overflow-y:scroll;
`