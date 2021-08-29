import { NextPage } from "next"
import { Row, Card, List, Avatar, Col, Tooltip, Tag, Tabs, Progress, notification } from 'antd';
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
import HighchartsReact from "highcharts-react-official";

const Home: NextPage<IInitialProps> = ({ bptUser }) => {

  const { TabPane } = Tabs;

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
    cardBody: {
      paddingTop: '10px',
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
      <Row gutter={[8,8]}>
        <Col span={8}>
          <Card bodyStyle={styles.cardBody} >
            <Tabs defaultActiveKey="portfolio">
              <TabPane tab="Portfolio" key="portfolio">
                <List
                  dataSource={balances.listData}
                  renderItem={(item:any) => (
                    <List.Item key={`${item.symbol}_${item.available}`} style={{ paddingLeft:'8px' }}>
                      <List.Item.Meta
                        avatar={<Avatar src={getCoinSymbolIcon(item.symbol)} />}
                        title={
                          <a href={getCoinInfo(item.symbol,true)} target="_blank">
                            {item.symbol}
                          </a>
                        }
                        description={item.available}
                      />
                      <Tag color='green'>{thbCurrency(item.marketValue)}</Tag>
                      </List.Item>
                  )}>
                </List> 
              </TabPane>
              <TabPane tab="Top Performance" key="performance">
                <List
                    dataSource={balances.listData.slice().sort((a:any, b:any) => Number(b.profitPercent) - Number(a.profitPercent))}
                    renderItem={(item:any) => (
                      <List.Item key={`${item.symbol}_${item.available}`} style={{ paddingLeft:'8px' }}>
                        <List.Item.Meta
                          avatar={<Avatar src={getCoinSymbolIcon(item.symbol)} />}
                          title={
                            <a href={getCoinInfo(item.symbol,true)} target="_blank">
                              {item.symbol}
                            </a>
                          }
                          description={item.available}
                        />
                        <PNL item={item}/>
                        </List.Item>
                    )}>
                  </List> 
              </TabPane>
            </Tabs>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Profit / Loss">
            <div style={{ width:'100%' }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: "column",
                  },
                  plotOptions: {
                    column: {
                      borderWidth: 0,
                      borderRadius: 5,
                      colorByPoint: true
                    },
                    series: {
                      // pointWidth: 50,
                      stacking: 'normal'
                    }
                  },
                  title: {
                    text: '',
                  },
                  credits: {
                    enabled: false
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
                    title: {
                      text: '',
                    }
                  },
                  legend: {
                    enabled: false
                  },
                  tooltip: {
                    formatter: function(){
                      let curElem:any = this;
                      if(curElem?.key){
                        const targetDep:any = balances.listData.find((e:any) => e.symbol == curElem?.key)
                        if(targetDep){
                          const { symbol, totalBought, marketPrice, marketValue, profitPercent, holdingPercent } = targetDep;
                          const isPositive = Number(profitPercent) > 0;
                          return `
                            <b>&nbsp;${symbol}</b><br/>
                            Market Price: ${thbCurrency(marketPrice)}<br/>
                            Total Invested: ${thbCurrency(totalBought)}<br/>
                            Current Value: ${thbCurrency(marketValue)}<br/>
                            ${isPositive ? 'Profit' : 'Loss'}: ${Number(profitPercent).toFixed(2)}% | ${thbCurrency(Number(marketValue) - Number(totalBought))}<br/>
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
                        y: Number(Number(eachItem.marketValue) - Number(eachItem.totalBought)),
                      }
                    })
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