import { Card, Table, Tabs } from 'antd';
import { useRecoilValue } from 'recoil';
import { avCoins } from '../recoils/atoms'

const { TabPane } = Tabs;

const Orders = () => {
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

  return (
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
  )
}

export default Orders