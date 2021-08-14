import { useState } from 'react'
import { Row, Col, Card, Form, Input, Button, Typography, notification} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { SIGNIN, SetCredentials } from '../documents'
import Router from 'next/router'
import styled from 'styled-components'

const LoginForm = ({ onSubmit }:any) => {
  return (
    <Form layout="vertical" className="loginForm" requiredMark={'optional'} onFinish={onSubmit}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}>
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="loginBtn">
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

const RegisterForm = () => {
  return (
    <Form layout="vertical" className="registerForm" requiredMark={'optional'}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}>
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="registerBtn">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

const UpdateCredentials = ({ onSubmit }:any) => {
  return (
    <Form layout="vertical" className="registerForm" requiredMark={'optional'} onFinish={onSubmit}>
      <Form.Item
        label="API KEY"
        name="key"
        rules={[{ required: true, message: 'Please input your key' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="API KEY" />
      </Form.Item>
      <Form.Item
        label="API SECRET"
        name="secret"
        rules={[{ required: true, message: 'Please input your secret key' }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="SECRET KEY"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="updateBtn">
          UPDATE KEY
        </Button>
      </Form.Item>
    </Form>
  )
}

const Authentication = () => {

  const [formObj, setFormObj] = useState({
    isLoginSuccess : false,
    isLoginActive : true,
    iskeyValid : false
  })

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
    },
    authForm:{
      border: 'unset',
    }
  };

  const [signin] = useMutation(SIGNIN, {
    onCompleted: ({ signin: { name, validKey }}) => {
      notification.success({ message: `Welcome ${name}` })
      if(validKey) Router.push({ pathname: '/' })
      if(!validKey){
        setFormObj({ ...formObj, isLoginSuccess:true, iskeyValid:validKey })
        setTimeout(() => notification.info({ message: 'Invalid Key', description: 'Please Update your key', duration : 0}), 500)
      }
    },
    onError: (err) => {
      notification.error({ message: 'Login Fail', description: 'Something went wrong' })
    }
  })

  const [setCredentials] = useMutation(SetCredentials, {
    onCompleted: (data) => {
      console.log('data',data);
    },
    onError: (err) => {
      console.log('err',err);
    }
  })

  const onLoginSubmit = (values:any) => {
    const { email, password } = values;
    signin({
      variables:{
        email,
        password
      }
    })
  }

  const onCredentialSubmit = (values:any) => {
    const { key, secret } = values;
    setCredentials({
      variables:{
        key,
        secret
      }
    })
  }

  const renderContent = () => {
    if(!formObj.isLoginSuccess){
      return formObj.isLoginActive ? <LoginForm onSubmit={onLoginSubmit} /> : <RegisterForm/>
    }
    if(formObj.isLoginSuccess && !formObj.iskeyValid){
      return <UpdateCredentials onSubmit={onCredentialSubmit} />
    }
  }

  const renderHelpInfo = () => {
    if(!formObj.isLoginSuccess){
      return formObj.isLoginActive ? (
        <p className="signUpLabel">Not a member?
          <span onClick={() => setFormObj({ ...formObj, isLoginActive: !formObj.isLoginActive })}>
            <strong> Sign up now</strong>
          </span>
        </p>
      ) : (
        <p className="signUpLabel">Already a member?
          <span onClick={() => setFormObj({
            ...formObj, isLoginActive: !formObj.isLoginActive
          })}>
          <strong> Login</strong></span>
        </p>
      )
    }
  }

  const renderTitle = () => {
    if(!formObj.isLoginSuccess){
      return formObj.isLoginActive ? 'Login' : 'Register'
    }
    if(formObj.isLoginSuccess && !formObj.iskeyValid){
      return 'Update Credentials'
    }
  }

  return (
    <AuthRoot>
      <Card style={styles.card} bodyStyle={styles.cardBody}>
        <Row>
          <Col span={12}>
            <LeftContainer>
              <img src="./images/report.gif"/>
            </LeftContainer>
          </Col>
          <Col span={12} style={{ height:490, background:'white', borderTopRightRadius:'6px', borderBottomRightRadius:'6px' }}>
            <RightContainer>
              <Card style={styles.authForm}>
                <Typography.Title level={2} style={{ marginBottom: '1em' }}>
                  {renderTitle()}
                </Typography.Title>
                { renderContent() }
              </Card>
            </RightContainer>
            { renderHelpInfo() }
          </Col>
        </Row>
      </Card>
    </AuthRoot>
  )
}

export default Authentication

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

const RightContainer = styled.div`
  padding:20px 20px 0 20px;
`