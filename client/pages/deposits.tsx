import React, { useEffect, useState } from 'react';
import { NextPage } from "next"
import { useQuery } from '@apollo/client'
import { QUERY_ALL_DEPOSIT } from '../documents'
import { Row, Card, Tag, Col, Timeline, List, Avatar, Tooltip, notification } from 'antd';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { getCoinInfo, getCoinSymbolIcon, thbCurrency, isInvalidKey } from '../utils'
import { useRecoilState } from 'recoil';
import { credentials, overview } from '../recoils/atoms'
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'
import Cookies from "next-cookies"
import Router from "next/router"
import moment from 'moment'

const Deposits: NextPage<IInitialProps> = () => {

  const [isValidKey, setValidKey] = useRecoilState(credentials);
  const [overViewData, setOverViewData] = useRecoilState(overview);

  const [deposits, setDeposits] = useState({
    fiat:[],
    fiatTotal:0,
    crypto: []
  })
  const { data, error } = useQuery(QUERY_ALL_DEPOSIT, { fetchPolicy: "network-only" })

  useEffect(() => {
    if(data && data.getAllDeposit){
      setValidKey(true);
      const { fiat, crypto } = data.getAllDeposit
      const totalFiatDeposit = fiat.reduce((total:any, eachDep:any) => {
        if(eachDep.status == 'complete'){
          total = total+eachDep.amount;
        }
        return total;
      },0)
      setDeposits({ fiat, fiatTotal:totalFiatDeposit, crypto })
      setOverViewData({ ...overViewData, totalFiatDeposit })
    }
    if(error){
      isInvalidKey(error, (isInvalid:boolean) => {
       if(isInvalid){
         setValidKey(false);
         notification.warn({ message: 'Invalid key detected', description:'Please setup your key' })
         Router.push({ pathname: "/auth/credentials" })
       }
     })
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

  return isValidKey ? (
    <div>
      <Row gutter={[8, 16]}>
        <Col span={10}>
          <Card hoverable title="Fiat Deposits" bordered={true} style={styles.card} bodyStyle={styles.cardBody}
            extra={
              <strong style={{ color:'green'}}>
                <Tooltip placement="topLeft" title={overViewData?.netWorth ? `Real Value : ${thbCurrency(overViewData?.netWorth)}` : ''}>
                  {thbCurrency(deposits.fiatTotal)}
                </Tooltip>
              </strong>
            }>
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