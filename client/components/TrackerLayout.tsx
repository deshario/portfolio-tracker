import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { Layout, Menu, notification } from 'antd';
import { CloudDownloadOutlined, WalletOutlined, CloudUploadOutlined, ApiOutlined, FileProtectOutlined, LogoutOutlined } from '@ant-design/icons';
import { SIGNOUT } from '../documents'
import { useMutation } from '@apollo/client'

const { Header, Content, Sider } = Layout;

const TrackerLayout = (props:any) => {

  const [signout]: any = useMutation(SIGNOUT,{
    onCompleted: ({ signout : { _id } }) => {
      if(_id){
        notification.success({ message: 'Logout Success' })
        Router.push({ pathname: '/auth/login' })
      }
    },
    onError: (err) => {
      console.log('signput',err);
      notification.error({ message: 'Logout Error', description: 'Please try again' })
    }
  })

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ height: '32px', background: '#616161', margin: '16px' }} />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="assets" icon={<WalletOutlined />}>
            <Link href="/">Assets</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<FileProtectOutlined />}>
            <Link href="/orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="deposits" icon={<CloudUploadOutlined />}>
            <Link href="/deposits">Deposits</Link>
          </Menu.Item>
          <Menu.Item key="withdrawls" icon={<CloudDownloadOutlined />}>
            <Link href="/withdrawls">WithDrawls</Link>
          </Menu.Item>
          <Menu.Item key="connection" icon={<ApiOutlined />}>
            <Link href="/connection">Connection</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <span onClick={() => signout()}>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="content-light">
        <Header className="header-light" />
        <Content>
          <div className="site-layout-background" style={{ padding: 24 }}>
            { props.children }
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default TrackerLayout