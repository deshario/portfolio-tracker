import { Row, Card, List, Avatar, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { keySecret } from '../recoils/atoms/keySecret'
import { useQuery } from '@apollo/client'
import PieChart from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { QUERY_BALANCE } from '../documents'

const Home = () => {

  const credentials = useRecoilValue(keySecret);
  const [balances, setBalances] = useState({
    listData: [],
    pieData: [],
    totalValue: '',
  })

  const { data, loading, error } = useQuery(QUERY_BALANCE, {
    variables:{
      key: credentials.btKey,
      secret: credentials.btSecret
    },
    fetchPolicy: "network-only",
  })

  const THB = (amount:number|string) => {
    let amountNum =  typeof amount == 'string' ? Number(amount) : amount
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amountNum)
  }

  useEffect(() => {
    const mData: any = data?.getBalance
    if(mData && mData.success){

      const netWorth = mData.balances.reduce((totalPrice:any, eachItem:any) => {
        const available = Number(eachItem.available);
        const value = Number(eachItem.value);
        totalPrice = totalPrice+(available*value)
        return totalPrice;
      },0);

      const totalBalances = mData.balances.map((eachItem:any) => {
        const available = Number(eachItem.available);
        const value = Number(eachItem.value);
        const totalValue = available*value;
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
      
    }
    if (error) console.log(`Err: ${error}`)
  }, [loading, error, data])

  const styles = {
    card: {
      width: 400,
    },
    cardBody: {
      paddingBottom: 'unset'
    }
  };

  return (
    <Row gutter={16}>
      <Col>
        <Card hoverable style={styles.card} bodyStyle={styles.cardBody}>
          <List
            dataSource={balances.listData}
            header={<div>Total Value : {THB(balances.totalValue)}</div>}
            renderItem={(item:any) => (
              <List.Item key={`${item.symbol}_${item.available}`}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a>{item.symbol}</a>}
                  description={item.available}
                />
                <div style={{ textAlign: 'right' }}>
                  <span>{item.percent}%</span><br/>
                  <span style={{ color:'green' }}>{THB(item.realValue)}</span>
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
  )
}

export default Home;