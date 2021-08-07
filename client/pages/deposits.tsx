import { Row, Card, List, Tag, Col, Timeline } from 'antd';
import { QUERY_FIAT_DEPOSIT } from '../documents'
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { keySecret } from '../recoils/atoms/keySecret'
import { useQuery } from '@apollo/client'
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

const Deposits = () => {

  const credentials = useRecoilValue(keySecret);
  const [deposits, setDeposits] = useState([])

  const { data } = useQuery(QUERY_FIAT_DEPOSIT, {
    variables:{
      key: credentials.btKey,
      secret: credentials.btSecret
    },
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    if(data && data.getFiatDeposit){
      const deposits: any = data?.getFiatDeposit
      setDeposits(deposits?.data)
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
      width: 380,
      maxHeight: '100%'
    },
    cardBody: {
      maxHeight: 500,
      overflow: 'auto',
      paddingBottom: 'unset'
    }
  };

  return (
    <div>
      <Card hoverable title="Fiat Deposits" bordered={true} style={styles.card} bodyStyle={styles.cardBody}>
        <Timeline mode={`left`}>
          {
            deposits.map((item:any, index:number) => {
              return (
                <Timeline.Item
                  key={index}
                  dot={<ItemDot status={item.status}/>}
                  color={itemColor(item.status)}>
                    <span style={{ color:itemColor(item.status) }}>
                      {THB(item.amount)} at {item.date}
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
    </div>
  )
}

export default Deposits

