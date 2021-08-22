import { NextPage } from "next"
import { Row, Card, List, Avatar, Col, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { credentials, overview } from '../recoils/atoms'
import { useQuery } from '@apollo/client'
import { QUERY_BALANCE } from '../documents'
import { getCoinInfo, getCoinSymbolIcon, thbCurrency, isInvalidKey } from '../utils'
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'
import Cookies from "next-cookies"
import Router from "next/router"
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";

const Home: NextPage<IInitialProps> = ({ bptUser }) => {

  const [isValidKey, setValidKey] = useRecoilState(credentials);
  const [overViewData, setOverViewData] = useRecoilState(overview);

  const [balances, setBalances] = useState({
    listData: [],
    pieData: [],
    totalValue: '',
  })

  const { data, error } = useQuery(QUERY_BALANCE, { fetchPolicy: "network-only" })

  useEffect(() => {
    const mData: any = data?.getBalance
    if(mData && mData.success){
      setValidKey(true);
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
      setBalances({
        listData: totalBalances,
        pieData: chartData,
        totalValue: Number(netWorth).toFixed(2)
      })
      setOverViewData({ ...overViewData, netWorth })
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
  }, [data,error])

  const styles = {
    card: {
      width: 400,
    },
    cardBody: {
      paddingBottom: 'unset'
    }
  };

  return isValidKey ? (
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

export default Home;