import Link from 'next/link'
import Router from 'next/router'
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  notification,
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { SIGNUP } from '../../documents'
import { IInitialProps } from '../../../interface'
import Cookies from 'next-cookies'
import styled from 'styled-components'
import mongoose from 'mongoose'

const Register = () => {
  const styles = {
    card: {
      border: 'unset',
    },
    cardBody: {
      paddingTop: 'unset',
      paddingBottom: 'unset',
    },
    divider: {
      marginBottom: 'unset',
    },
  }

  const [signup] = useMutation(SIGNUP, {
    onCompleted: ({ signup: { _id } }) => {
      if (mongoose.Types.ObjectId.isValid(_id)) {
        notification.success({
          message: 'Register Success',
          description: 'Please login to continue',
        })
        Router.push({ pathname: '/auth/login' })
      }
    },
    onError: (err) => {
      if (err?.message.includes('duplicate')) {
        notification.error({
          message: 'Duplicate email detected',
          description: 'Please try new one',
        })
      }
    },
  })

  const onSubmit = (values: any) => {
    const { email, password } = values
    signup({
      variables: {
        email,
        password,
      },
    })
  }

  return (
    <Container>
      <Card style={styles.card} bodyStyle={styles.cardBody}>
        <Divider style={styles.divider}>
          <Typography.Title level={2}>Register</Typography.Title>
        </Divider>
        <Form
          layout='vertical'
          className='registerForm'
          requiredMark={'optional'}
          onFinish={onSubmit}
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { type: 'email', message: 'Please input valid email' },
              { required: true, message: 'Please input your email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              { required: true, message: 'Please input your Password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value.length > 0 && value.length < 8) {
                    return Promise.reject('Unsecured password detected!')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item
            label='Confirm Password'
            name='cPassword'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Please input same password'))
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='Confirm Password'
            />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='registerBtn'>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <p className='signUpLabel'>
        Already a member?
        <span>
          <Link href='/auth/login'>
            <strong> Login</strong>
          </Link>
        </span>
      </p>
    </Container>
  )
}

export default Register

const Container = styled.div`
  padding: 20px 20px 0 20px;
`

Register.getInitialProps = async (ctx: any): Promise<IInitialProps> => {
  const { res } = ctx
  const { bptUser, bptToken }: any = Cookies(ctx)
  const redirect = (path: string) => {
    if (res) {
      res.writeHead(302, { Location: path })
      res.end()
    } else {
      Router.push({ pathname: path })
    }
  }
  if (bptUser?._id && !bptUser?.validKey) redirect('/auth/credentials')
  if (bptUser?._id && bptUser?.validKey) redirect('/')
  return { bptUser, bptToken }
}
