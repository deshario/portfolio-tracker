import { NextPage } from "next"
import Cookies from "next-cookies"
import Router from "next/router"
import { Card, Form, Input, Button, Typography, Divider, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { SetCredentials } from '../../documents'
import { IInitialProps } from '../../../interface'
import styled from 'styled-components'

const Credentials: NextPage<IInitialProps> = ({ user, token }) => {

  const styles = {
    card:{
      border: 'unset',
    },
    cardBody:{
      paddingTop:'unset'
    }
  };

  const [setCredentials] = useMutation(SetCredentials, {
    onCompleted: ({ setCredentials: { success, info }}) => {
      if(success){
        notification.success({ message: info, description: 'Welcome to portfolio tracker' })
        // Router.push({ pathname: '/' })
      }
      if(!success && info){
        notification.error({ message: info, description: 'Please try again with valid credentials' })
      }
    },
    onError: (err) => {
      console.log('err:',err)
      notification.error({ message: 'Something went wrong', description: 'Please try again' })
    }
  })

  const onSubmit = (values:any) => {
    const { key, secret } = values;
    setCredentials({
      variables:{
        key,
        secret
      }
    })
  }

  return (
    <Container>
      <Card style={styles.card} bodyStyle={styles.cardBody}>
        <Divider>
          <Typography.Title level={2} style={{ marginBottom: '10px' }}>Credentials</Typography.Title>
        </Divider>
        <Typography.Title level={5} style={{ marginTop:'unset', marginBottom: '1.5em' }}>
          Hey {user?.name || ''}! Please setup your key
        </Typography.Title>
        <Form layout="vertical" className="registerForm" requiredMark={'optional'} onFinish={onSubmit}>
          <Form.Item label="API KEY" name="key" rules={[{ required: true, message: 'Please input your key' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="API KEY" />
          </Form.Item>
          <Form.Item label="API SECRET" name="secret" rules={[{ required: true, message: 'Please input your secret key' }]}>
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
      </Card>
    </Container>
  )
}

export default Credentials

const Container = styled.div`
  padding:20px 20px 0 20px;
`

Credentials.getInitialProps = async (ctx: any): Promise<IInitialProps> => {
  const { req, res } = ctx
  const userAgent: string = req ? req.headers["user-agent"] || "" : navigator.userAgent
  const { user, token }: any = Cookies(ctx)

  if (!user?._id) {
    if (res) {
      res.writeHead(302, {
        Location: "/auth/login",
      })
      res.end()
    } else {
      Router.push({ pathname: "/auth/login" })
    }
  }
  return { userAgent, user, token }
}
