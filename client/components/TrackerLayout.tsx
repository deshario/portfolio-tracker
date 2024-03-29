import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { Layout, Menu, Avatar, Divider, notification } from 'antd'
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  PieChartOutlined,
  FileProtectOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { SIGNOUT } from '../documents'
import { useMutation } from '@apollo/client'
import { useRecoilState } from 'recoil'
import { credentials } from '../recoils/atoms'

const { Header, Content, Sider } = Layout

const TrackerLayout = (props: any) => {
  const [isValidKey, setValidKey] = useRecoilState(credentials)

  const [signout]: any = useMutation(SIGNOUT, {
    onCompleted: ({ signout: { _id } }) => {
      if (_id) {
        setValidKey(false)
        notification.success({ message: 'Logout Success' })
        Router.push({ pathname: '/auth/login' })
      }
    },
    onError: (err) => {
      console.log('signput', err)
      notification.error({
        message: 'Logout Error',
        description: 'Please try again',
      })
    },
  })

  const getUserAlias = () => {
    const { bptUser } = props
    const alias = `${bptUser?.name[0]}${bptUser?.name[
      bptUser?.name.length - 1
    ]}`
    return alias.toUpperCase()
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light'>
        <div style={{ margin: '15px 20px 0 20px', cursor: 'pointer' }}>
          <Avatar
            style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
            size='large'
          >
            {getUserAlias()}
          </Avatar>
          <span style={{ marginLeft: 5 }}> {props?.bptUser?.name}</span>
        </div>
        <Divider style={{ margin: '15px 0' }} />
        <Menu theme='light' defaultSelectedKeys={['1']} mode='inline'>
          <Menu.Item key='overview' icon={<PieChartOutlined />}>
            <Link href='/'>Overview</Link>
          </Menu.Item>
          <Menu.Item key='orders' icon={<FileProtectOutlined />}>
            <Link href='/orders'>Orders</Link>
          </Menu.Item>
          <Menu.Item key='deposits' icon={<CloudUploadOutlined />}>
            <Link href='/deposits'>Deposits</Link>
          </Menu.Item>
          <Menu.Item key='withdrawls' icon={<CloudDownloadOutlined />}>
            <Link href='/withdrawls'>WithDrawls</Link>
          </Menu.Item>
          <Menu.Item key='logout' icon={<LogoutOutlined />}>
            <span onClick={() => signout()}>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='content-light'>
        {/* <Header className="header-light" /> */}
        <Content>
          <div
            className='site-layout-background'
            style={{ padding: 24, height: '100%' }}
          >
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default TrackerLayout
