import { NextPage } from "next"
import { Row, Card, List, Avatar, Col, Tooltip, Tag, Progress, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { credentials, overview } from '../recoils/atoms'
import { useQuery } from '@apollo/client'
import { QUERY_BALANCE } from '../documents'
import { getCoinInfo, getCoinSymbolIcon, thbCurrency, isInvalidKey, formatCash } from '../utils'
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'
import Cookies from "next-cookies"
import Router from "next/router"
import Highcharts from "highcharts/highstock";
import PieChart from "highcharts-react-official";

const Home: NextPage<IInitialProps> = ({ bptUser }) => {

  const [isValidKey, setValidKey] = useRecoilState(credentials);
  const [overViewData, setOverViewData] = useRecoilState(overview);
  const [balances, setBalances] = useState({ netWorth: '', listData: [] })

  const { data, error } = useQuery(QUERY_BALANCE, { fetchPolicy: "network-only" })

  useEffect(() => {
    const mData: any = data?.getBalance
    if(mData && mData.success){
      const { netWorth, balances:payload } = mData;
      setValidKey(true);
      setBalances({ listData: payload, netWorth })
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
      width: 500,
    },
    cardBody: {
      paddingBottom: 'unset'
    }
  };

  const PNL = ({ item }:any) => {
    const profit = Number(item.profitPercent).toFixed(2);
    const profitLabel = profit.includes('-') ? `${profit}%` : `+${profit}%`
    return (
      <Tag color={profit.includes('-') ? 'red' : 'green'} style={{ marginLeft:5 }}>
        {profitLabel}
      </Tag>
    )
  }

  return isValidKey ? (
    <Row gutter={[8, 16]}>
      <Col span={12}>
        <Card hoverable style={styles.card} bodyStyle={styles.cardBody}>
          <List
            dataSource={balances.listData}
            header={<div>Market Value : {thbCurrency(balances.netWorth)}</div>}
            renderItem={(item:any) => (
              <List.Item key={`${item.symbol}_${item.available}`}>
                <List.Item.Meta
                  avatar={<Avatar src={getCoinSymbolIcon(item.symbol)} />}
                  title={
                    <a href={getCoinInfo(item.symbol,true)} target="_blank">
                      {item.symbol}
                      <PNL item={item}/>
                    </a>
                  }
                  description={<Progress percent={item.holdingPercent} showInfo={false} />}
                />
                <div style={{ textAlign: 'right' }}>
                  <Tooltip placement="left" title={'Holdings'}>
                    <Tag color='blue'>{item.available}</Tag>
                  </Tooltip>
                  <br/>
                  <Tag color='green' style={{ marginTop:5 }}>{thbCurrency(item.marketValue)}</Tag>
                </div>
              </List.Item>
            )}>
          </List>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Profit / Loss" style={styles.card}>
          <div style={{ width:'100%' }}>
            <PieChart
              highcharts={Highcharts}
              options={{
                chart: {
                  type: "pie"
                },
                title: {
                  text: ''
                },
                credits: {
                  enabled: false
                },
                tooltip: {
                  formatter: function(){
                    let curElem:any = this;
                    if(curElem?.key){
                      const targetDep:any = balances.listData.find((e:any) => e.symbol == curElem?.key)
                      if(targetDep){
                        const { symbol, totalBought, marketPrice, marketValue, profitPercent, holdingPercent } = targetDep;
                        return `
                          <b>&nbsp;${symbol}</b><br/>
                          Market Price: ฿${Number(marketPrice).toFixed(2)}<br/>
                          Current Value : ฿${Number(marketValue).toFixed(2)}<br/>
                          Profit Value: ฿${Number(Number(marketValue) - Number(totalBought)).toFixed(2)}<br/>
                          Profit Percent: ${Number(profitPercent).toFixed(2)}%<br/>
                          Holdings: ${Number(holdingPercent).toFixed(2)}%<br/>
                        `;
                      }
                    }
                    return `Profit: ${formatCash(curElem.y)}`;
                  }
                },
                series: [{
                  data: balances.listData.map((eachItem:any) => {
                    return {
                      name: eachItem.symbol,
                      y: Number(Number(eachItem.marketValue) - Number(eachItem.totalBought))
                    }
                  }).filter((e:any) => e.y > 0)
                }],
              }}
            />
          </div>
        </Card>
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