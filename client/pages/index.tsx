import { Row, Card, List, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { keySecret } from '../recoils/atoms/keySecret'
import { useLazyQuery, useQuery } from '@apollo/client'
import { QUERY_BALANCE } from '../documents'

const Home = () => {

  const credentials = useRecoilValue(keySecret);
  const [balances, setBalances] = useState([])

  const { data, loading, error } = useQuery(QUERY_BALANCE, {
    variables:{
      key: credentials.btKey,
      secret: credentials.btSecret
    },
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    const mData: any = data?.getBalance
    if(mData && mData.success){
      setBalances(mData.balances)
    }
    if (error) console.log(`Err: ${error}`)
  }, [loading, error, data])
  
  return (
    <Row gutter={16}>
       <Card hoverable style={{ width: 400 }}>
        <List
            dataSource={balances}
            renderItem={(item:any) => (
              <List.Item key={`${item.symbol}_${item.available}`}>
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

export default Home;
