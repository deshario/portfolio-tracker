import { Card, Table, Tabs } from 'antd';
import { avCoins } from '../recoils/atoms'
import { NextPage } from "next"
import { useRecoilValue, useRecoilState } from 'recoil';
import { credentials } from '../recoils/atoms'
import { Loader } from '../components/Loader'
import { IInitialProps } from '../../interface'
import Cookies from "next-cookies"
import Router from "next/router"

const { TabPane } = Tabs;

const Orders: NextPage<IInitialProps> = () => {

  // const [isValidKey, setValidKey] = useRecoilState(credentials);
  const isValidKey = useRecoilValue(credentials);

  console.log('Orders ',isValidKey);

  const coins = useRecoilValue(avCoins);

  const styles = {
    cardBody: {
      paddingTop: '5px'
    }
  };

  const onOrderTabChange = (key:string) => console.log('Query : ',key);

  const dataSource = [
    {
      key: 1,
      amount: 0.000032,
      rate: 32,
      fees: 20,
    }
  ];

  return isValidKey ? (
    <div>
      <Card title="Orders" bodyStyle={styles.cardBody}>
        <Tabs defaultActiveKey={coins[0]} onChange={onOrderTabChange}>
          {
            coins.map((coin:string) => {
              return (
                <TabPane tab={coin.replace('THB_','')} key={coin}>
                  <Table
                  bordered
                  pagination={false}
                  dataSource={dataSource}
                  columns={[
                    {
                      title: '#',
                      dataIndex: 'id',
                      key: 'id',
                      width:'10px'
                    },
                    {
                      title: 'Amount',
                      dataIndex: 'amount',
                      key: 'amount',
                    },
                    {
                      title: 'Rate',
                      dataIndex: 'rate',
                      key: 'rate',
                    },
                    {
                      title: 'Fees',
                      dataIndex: 'fees',
                      key: 'fees',
                    },
                  ]}
                  />
                </TabPane>
              )
            })
          }
      </Tabs>
      </Card>
    </div>
  ) : <Loader/>
}

Orders.getInitialProps = async (ctx: any): Promise<IInitialProps> => {
  const { req, res } = ctx
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

export default Orders