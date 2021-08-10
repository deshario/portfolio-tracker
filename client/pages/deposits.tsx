import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client'
import { useRecoilValue } from 'recoil';
import { keySecret } from '../recoils/atoms/keySecret'
import { QUERY_ALL_DEPOSIT } from '../documents'
import { Row, Card, Tag, Col, Timeline, List, Avatar } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getCoinInfo, getCoinSymbolIcon } from '../utils'
import moment from 'moment'

const Deposits = () => {

  const credentials = useRecoilValue(keySecret);
  const [deposits, setDeposits] = useState({
    fiat:[],
    crypto: []
  })
  const { data } = useQuery(QUERY_ALL_DEPOSIT, {
    variables:{
      key: credentials.btKey,
      secret: credentials.btSecret
    },
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    if(data && data.getAllDeposit){
      const { fiat, crypto } = data.getAllDeposit
      setDeposits({ fiat, crypto })
    }
  },[data]);

  const THB = (amount:number|string) => {
    let amountNum =  typeof amount == 'string' ? Number(amount) : amount
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amountNum)
  }

  type Status = { status: string; }
  
  const ItemDot = ({ status }: Status) => {
    if(status == "complete"){
      return <CheckCircleOutlined style={{ fontSize: '16px' }} />
    }
    return <StopOutlined style={{ fontSize: '16px' }} />
  }

  const itemColor = (status:string) => status == "complete" ? 'green' : 'red'

  const styles = {
    card: {
      maxHeight: '100%'
    },
    cardBody: {
      maxHeight: 530,
      overflow: 'auto',
      paddingBottom: 'unset'
    },
    cryptoBox:{
      marginLeft:'1px'
    }
  };

  return (
    <div>
      <Row gutter={[8, 16]}>
        <Col span={10}>
          <Card hoverable title="Fiat Deposits" bordered={true} style={styles.card} bodyStyle={styles.cardBody}>
            <Timeline>
              {
                deposits.fiat.map((item:any, index:number) => {
                  return (
                    <Timeline.Item
                      key={index}
                      dot={<ItemDot status={item.status}/>}
                      color={itemColor(item.status)}>
                        <span style={{ color:itemColor(item.status) }}>
                          {THB(item.amount)} at 
                          <Tag color='blue' style={{ marginLeft:'10px'}}>
                            {moment.unix(item.time).format("MMMM Do YYYY, HH:mm")}
                          </Tag>
                          <Tag color={itemColor(item.status)} style={{ marginLeft:'10px', float:'right'}}>
                            {item.status}
                          </Tag>
                        </span>
                    </Timeline.Item>
                  )
                })
              }
            </Timeline>
          </Card>
        </Col>
        <Col span={14}>
          <Card hoverable title="Crypto Deposits" bordered={true} style={styles.card} bodyStyle={styles.cardBody}>
            <List
              dataSource={deposits.crypto}
              renderItem={(item:any) => (
                <List.Item key={item.time}>
                  <List.Item.Meta
                    avatar={<Avatar src={getCoinSymbolIcon(item.currency)}/>}
                    title={<a href={getCoinInfo(item.currency,true)} target="_blank">{item.currency}</a>}
                    description={item.amount}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <Tag color={itemColor(item.status)} >{item.status}</Tag>
                    <br/>
                    <Tag color='pink' style={{ marginTop:'5px'}}>
                      {moment.unix(item.time).format("MMMM Do YYYY")}
                    </Tag>
                  </div>
                </List.Item>
              )}>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Deposits