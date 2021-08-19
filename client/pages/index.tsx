import { NextPage } from "next"
import { Row, Card, List, Avatar, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { keySecret, avCoins, credentials } from '../recoils/atoms'
import { useQuery } from '@apollo/client'
import PieChart from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { QUERY_BALANCE } from '../documents'
import { getCoinInfo, getCoinSymbolIcon, thbCurrency } from '../utils'
import Cookies from "next-cookies"
import Router from "next/router"
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'

const Home: NextPage<IInitialProps> = ({ bptUser, bptToken }) => {

  // const credentials = useRecoilValue(keySecret);
  const [availableCoins, setAvailableCoins] = useRecoilState(avCoins);
  const [isInvalidCreds, setInvalidCreds] = useRecoilState(credentials);

  console.log('isInvalidCreds',isInvalidCreds)
  
  const [balances, setBalances] = useState({
    listData: [],
    pieData: [],
    totalValue: '',
  })

  const { data, error } = useQuery(QUERY_BALANCE, { fetchPolicy: "network-only" })

  useEffect(() => {
    if(error){
      if(`${error}`.includes('Invalid key')){
        console.log('invalid key')
        setInvalidCreds(true);
        Router.push({ pathname: "/auth/credentials" })
      }
    }

    const mData: any = data?.getBalance
    if(mData && mData.success){
      setInvalidCreds(false);
      const netWorth =  mData.balances.reduce((totalPrice:any, eachItem:any) => {
        const available = Number(eachItem.available);
        const value = Number(eachItem.value);
        const thVal = eachItem.symbol == "THB" ? available*1 : available*value;
        totalPrice = totalPrice+(thVal)
        return totalPrice;
      },0);

      const totalBalances =  mData.balances.map((eachItem:any) => {
        const available = Number(eachItem.available);
        const value = Number(eachItem.value);
        const totalValue = eachItem.symbol == "THB" ? available*1 : available*value
        const percent = (totalValue / Number(netWorth)) * 100;
        return {
          ...eachItem,
          realValue: Number(totalValue).toFixed(2),
          percent:Number(percent).toFixed(2)
        }
      });

      const chartData = mData.balances.map((eachItem:any) => {
        const available = Number(eachItem.available);
        const value = Number(eachItem.value);
        const totalValue = Number(available*value).toFixed(2)
        return {
          name: eachItem.symbol,
          y: Number(totalValue)
        }
      });

      const coinsOnly = mData.balances.map((sym:any) => `THB_${sym.symbol}`)

      setAvailableCoins(coinsOnly);

      setBalances({
        listData: totalBalances,
        pieData: chartData,
        totalValue: Number(netWorth).toFixed(2)
      })
      
    }
  }, [data,error])

  const styles = {
    card: {
      width: 400,
    },
    cardBody: {
      paddingBottom: 'unset'
    }
  };

  return !isInvalidCreds ? (
    <Row gutter={[8, 16]}>
      <Col>
        <Card hoverable style={styles.card} bodyStyle={styles.cardBody}>
          <List
            dataSource={balances.listData}
            header={<div>Total Value : {thbCurrency(balances.totalValue)}</div>}
            renderItem={(item:any) => (
              <List.Item key={`${item.symbol}_${item.available}`}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={getCoinSymbolIcon(item.symbol)} />
                  }
                  title={<a href={getCoinInfo(item.symbol,true)} target="_blank">{item.symbol}</a>}
                  description={item.available}
                />
                <div style={{ textAlign: 'right' }}>
                  <span>{item.percent}%</span><br/>
                  <span style={{ color:'green' }}>{thbCurrency(item.realValue)}</span>
                </div>
              </List.Item>
            )}>
          </List>
        </Card>
      </Col>
      <Col>
        <PieChart
          highcharts={Highcharts}
          options={{
            chart: {
              type: "pie"
            },
            title: {
              text: 'Total Holdings'
            },
            credits: {
              enabled: false
            },
            series: [{
              data: balances.pieData
            }],
          }}
        />
      </Col>
    </Row>
  ) : <Loader/>
}

Home.getInitialProps = async (ctx: any): Promise<IInitialProps> => {
  const { req, res } = ctx
  const userAgent: string = req ? req.headers["user-agent"] || "" : navigator.userAgent
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
  return { userAgent, bptUser, bptToken }
}

export default Home;