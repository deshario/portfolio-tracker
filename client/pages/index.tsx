import Highcharts from 'highcharts'
import PieChart from "highcharts-react-official";
import { Row, Col, Card, List, Space, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { keySecret } from '../recoils/atoms/keySecret'
// import axios from 'axios';

export default function Home() {

  const credentials = useRecoilValue(keySecret);
  const [balances, setBalances] = useState([])

  // const fetchAPI = async () => {
  //   const options = {
  //     headers: {'Content-Type': 'application/json'}
  //   };
  //   const payload = { key: credentials.btKey, secret: credentials.btSecret };
  //   const res:any = await axios.post(`/api/hello`, payload, options)
  //   const { data } = res;
  //   if(data?.success){
  //     setBalances(data?.balances);
  //   }
  // }

  // useEffect(() => {
  //   fetchAPI()
  // },[])
  
  return (
    <Row gutter={16}>
       <Card hoverable style={{ width: 400 }}>
        <List
            dataSource={balances}
            renderItem={(item:any) => (
              <List.Item key={'item.id'}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a>{item.symbol}</a>}
                  description={item.available}
                />
                <div>40%</div>
              </List.Item>
            )}>
        </List>
      </Card>

      {/* <Space size={[8, 16]} wrap>
      {
        balances.map((e:any) => {
          return (
            
            <Card key={`${e.symbol}_${e.available}`} hoverable style={{ width: 250 }}  actions={[
              <>
              <span className={`ant-card-meta-title`}>50%</span>
              </>
            ]}>
              <Row>
                <Col flex={4}>
                  <span className={`ant-card-meta-title`}>{e.symbol}</span>
                </Col>
                <Col flex={1}>
                  <span style={{ color:'rgba(0, 0, 0, 0.45)' }}>{e.available}</span>
                </Col>
              </Row>
              
            </Card>
          )
        })
      }
      </Space>
    */}
    </Row>
  )
}
