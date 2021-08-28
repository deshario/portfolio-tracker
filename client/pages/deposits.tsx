import React, { useEffect, useState } from 'react';
import { NextPage } from "next"
import { useQuery } from '@apollo/client'
import { QUERY_ALL_DEPOSIT } from '../documents'
import { Row, Card, Tag, Col, List, Avatar, Tooltip, notification, Empty } from 'antd';
import { getCoinInfo, getCoinSymbolIcon, thbCurrency, isInvalidKey, formatCash } from '../utils'
import { useRecoilState } from 'recoil';
import { credentials, overview } from '../recoils/atoms'
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'
import Cookies from "next-cookies"
import Router from "next/router"
import moment from 'moment'
import styled from 'styled-components'
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

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
      const groupedFiat = fiat.reduce((grouped:any, eachItem:any) => {
        if(eachItem.status === "complete"){
          let date = moment.unix(eachItem.time).format('MMM YYYY');
          const isExist = grouped.find((eI:any) => eI.date === date);
          if(isExist){
            isExist['deposits'].push(eachItem)
          }else{
            grouped.push({ date: date, deposits:[eachItem] });
          }
        }
        return grouped;
      },[]).map((eachMonth:any) => {
        const total = eachMonth.deposits.reduce((total:Number, eachDep:any) => total+eachDep.amount,0);
        return {
          name: eachMonth.date,
          key: eachMonth.date,
          y: total,
          profit: 20
          // color: '#66BB6A'
        }
      }).reverse();
      const totalFiatDeposit = groupedFiat.reduce((total:Number, eachItem:any) => total+eachItem.y, 0)
      setDeposits({ fiat:groupedFiat, fiatTotal:totalFiatDeposit, crypto })
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

  const itemColor = (status:string) => status == "complete" ? 'green' : 'red'

  const styles = {
    card: {
      maxHeight: '100%',
      // width:'100%'
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

  const DepositChart = () => {
    return deposits?.fiat?.length > 0 ? (
      <div style={{ width:'100%'}}>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: {
              type: 'column'
            },
            credits: {
              enabled: false
            },
            title: {
              text: ''
            },
            xAxis: {
              type: 'category',
              labels: {
                rotation: -45,
                style: {
                  fontSize: '10px',
                  fontWeight: 'bold',
                  fontFamily: 'Verdana, sans-serif'
                }
              }
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Amount'
              }
            },
            legend: {
              enabled: false
            },
            tooltip: {
              formatter: function(){
                // const activeKey = curElem?.points[0]?.key;
                // if(activeKey){
                //   const targetDep:any = deposits.fiatChart.find((e:any) => e.key == activeKey)
                //   if(targetDep?.profit){
                //     console.log('targetDep ----',targetDep?.profit)
                //   }
                // }
                let curElem:any = this;
                return `${formatCash(curElem.y)}`;
              }
            },
            series: [{
              name: 'Fiat',
              data: deposits.fiat,
              color: '#66BB6A',
            }]
          }}
        />
      </div>
    ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
  }

  return isValidKey ? (
    <div>
      <Row gutter={[8, 16]}>
        <Col span={16}>
          <FiatCard hoverable title="Fiat Deposits" bordered={true} style={styles.card} bodyStyle={styles.cardBody}
            extra={
              <strong style={{ color:'green'}}>
                <Tooltip placement="topLeft" title={overViewData?.netWorth ? `Real Value : ${thbCurrency(overViewData?.netWorth)}` : ''}>
                  <Tag color='green'>{thbCurrency(deposits.fiatTotal)}</Tag>
                </Tooltip>
              </strong>
            }>
            <DepositChart />
          </FiatCard>
        </Col>
        <Col span={8}>
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

export const FiatCard = styled(Card)`
  > .ant-card-head{
    padding-right:5px;
  }
  > .ant-card-head .ant-card-extra{
    padding:unset;
  }
`