import Link from 'next/link'
import Router from 'next/router'
import { Card, Form, Input, Button, Typography, Divider, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { SIGNIN } from '../../documents'
import styled from 'styled-components'

const Login = () => {

  const styles = {
    card:{
      border: 'unset',
    },
    cardBody:{
      paddingTop:'unset'
    }
  };

  const [signin] = useMutation(SIGNIN, {
    onCompleted: ({ signin: { name, validKey }}) => {
      notification.success({ message: `Welcome ${name}` })
      if(validKey) Router.push({ pathname: '/' })
      if(!validKey){
        setTimeout(() => notification.info({ message: 'Invalid Key', description: 'Please setup your key', duration : 0}), 500)
        Router.push({ pathname: '/auth/credentials' })
      }
    },
    onError: (err) => {
      const errTitle = err?.message.includes('Invalid') ? "Invalid Credentials" : "Something went wrong";
      notification.error({ message: errTitle, description: 'Please try again' })
    }
  })

  const onSubmit = (values:any) => {
    const { email, password } = values;
    signin({
      variables:{
        email,
        password
      }
    })
  }

  return (
    <Container>
      <Card style={styles.card} bodyStyle={styles.cardBody}>
        <Divider>
          <Typography.Title level={2}>Login</Typography.Title>
        </Divider>
        <Form layout="vertical" className="loginForm" requiredMark={'optional'} onFinish={onSubmit}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginBtn">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <p className="signUpLabel">Not a member?
        <span>
          <Link href='/auth/register'>
            <strong> Sign up now</strong>
          </Link>
        </span>
      </p>
    </Container>
  )
}

export default Login

const Container = styled.div`
  padding:20px 20px 0 20px;
`