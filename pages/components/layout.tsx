import { Layout, Menu } from 'antd';
import { CloudDownloadOutlined, WalletOutlined, CloudUploadOutlined, ApiOutlined } from '@ant-design/icons';
import Link from 'next/link'
import React from 'react'

const { Header, Content, Sider } = Layout;

const TrackerLayout = (props:any) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ height: '32px', background: '#616161', margin: '16px' }} />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="assets" icon={<WalletOutlined />}>
            <Link href="/">Assets</Link>
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
        </Menu>
      </Sider>
      <Layout className="content-light">
        <Header className="header-light" />
        <Content >
          <div className="site-layout-background" style={{ padding: 24 }}>
            { props.children }
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default TrackerLayout