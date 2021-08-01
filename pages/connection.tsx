import React, { useEffect } from 'react'
import { Card, Form, Input, Button, notification } from 'antd';
import { useRecoilState } from 'recoil';
import { keySecret } from '../recoils/atoms/keySecret'

const Connection = () => {

  const [form] = Form.useForm()
  const [credentials, setCredentials] = useRecoilState(keySecret);

  useEffect(() => {
    form.setFieldsValue({ key: credentials?.btKey, secret: credentials?.btSecret });
  },[credentials])

  const manualSubmit = () => {
    const { key, secret } = form.getFieldsValue();
    if((key == undefined || key == '') || (secret == undefined || secret == '')){
      notification.error({ key:'invalidForm', message: `Invalid Form` });
      return;
    }
    setCredentials({ btKey:key, btSecret:secret });
    notification.success({ key:'credentialSaved', message: 'Connection Success' });
  }

  const resetForm = () => {
    form.resetFields();
    if(localStorage){
      setCredentials({ btKey:'', btSecret:'' });
      if(Object.values(credentials).every(x => x != null && x != undefined && x != '')){
        notification.success({ key:'credentialDestroy', message: 'Connection Terminated' });
      }
    }
  }

  const isConnected = Object.values(credentials).every(x => x == '');

  return (
    <div>
      <Card title="Connection" bordered={true} extra={<a href="https://www.bitkub.com/publicapi" target="_blank">Get Credentials</a>}>
        <Form form={form} layout="vertical">
          <Form.Item name="key" label="API KEY" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="secret" label="API SECRET" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="button" onClick={manualSubmit} disabled={!isConnected}>Connect</Button>&nbsp;&nbsp;
            <Button type="primary" htmlType="button" onClick={resetForm} disabled={isConnected} danger>Terminate</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
  
}

export default Connection