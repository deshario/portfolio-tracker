import React, { useEffect, useState } from 'react';
import { NextPage } from "next"
import { useQuery } from '@apollo/client'
import { QUERY_ALL_DEPOSIT } from '../documents'
import { Row, Card, Tag, Col, Timeline, List, Avatar } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getCoinInfo, getCoinSymbolIcon, thbCurrency } from '../utils'
import Router from "next/router"
import { useRecoilValue, useRecoilState } from 'recoil';
import { credentials } from '../recoils/atoms'
import Cookies from "next-cookies"
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'
import moment from 'moment'

const Deposits: NextPage<IInitialProps> = () => {

  const [isInvalidCreds, setInvalidCreds] = useRecoilState(credentials);

  const [deposits, setDeposits] = useState({
    fiat:[],
    crypto: []
  })
  const { data, error } = useQuery(QUERY_ALL_DEPOSIT, { fetchPolicy: "network-only" })

  useEffect(() => {
    if(error){
      if(`${error}`.includes('Invalid key')){
        setInvalidCreds(true);
        Router.push({ pathname: "/auth/credentials" })
      }
    }
    if(data && data.getAllDeposit){
      setInvalidCreds(false);
      const { fiat, crypto } = data.getAllDeposit
      setDeposits({ fiat, crypto })
    }
  },[data,error]);

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

  return !isInvalidCreds ? (
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
                          {thbCurrency(item.amount)} at 
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
  ) : <Loader />
} 

Deposits.getInitialProps = async (ctx: any): Promise<IInitialProps> => {
  const { res } = ctx
  const { bptUser, bptToken }: any = Cookies(ctx)
  const redirect = (path:string) => {
    if (res) {
      res.writeHead(302, { Location: path })
      res.end()
    } else {
      Router.push({ pathname: path })
    }
  }
  if (!bptUser?._id){
    redirect("/auth/login")
  }
  if(bptUser?._id && !bptUser?.validKey){
    redirect("/auth/credentials")
  }
  return { bptUser, bptToken }
}

export default Deposits