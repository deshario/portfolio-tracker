import { Layout, Menu } from 'antd';
import { CloudDownloadOutlined, WalletOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const TrackerLayout = (props:any) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ height: '32px', background: '#616161', margin: '16px' }} />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="assets" icon={<WalletOutlined />}>Assets</Menu.Item>
          <Menu.Item key="deposits" icon={<CloudUploadOutlined />}>Deposits</Menu.Item>
          <Menu.Item key="withdrawls" icon={<CloudDownloadOutlined />}>WithDrawls</Menu.Item>
        </Menu>
      </Sider>
      <Layout className="content-light">
        <Header className="header-light" />
        <Content style={{ overflow: 'initial' }}>
          <div className="site-layout-background" style={{ padding: 24,}}>
            { props.children }
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default TrackerLayout