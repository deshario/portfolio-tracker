import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useQuery, useLazyQuery } from '@apollo/client'
import { QUERY_DEPOSIT_SYMBOLS, QUERY_ORDER } from '../documents'
import { Card, Table, Tabs, Tag, Tooltip, notification } from 'antd'
import { isInvalidKey, thbCurrency } from '../utils'
import { useRecoilState } from 'recoil'
import { credentials } from '../recoils/atoms'
import { IInitialProps } from '../../interface'
import { Loader } from '../components/Loader'
import Cookies from 'next-cookies'
import Router from 'next/router'
import moment from 'moment'

const { TabPane } = Tabs

const Orders: NextPage<IInitialProps> = () => {
  const [isValidKey, setValidKey] = useRecoilState(credentials)
  const [isLoading, setIsLoading] = useState(false)
  const [symbols, setSymbols] = useState([])
  const [symbolData, setSymbolData] = useState([])

  const [ovData, setOvData] = useState({
    totalAmount: 0,
    totalFees: 0,
    avgPrice: 0,
  })

  const { data, error } = useQuery(QUERY_DEPOSIT_SYMBOLS, {
    fetchPolicy: 'network-only',
  })

  const [getOrderHistory] = useLazyQuery(QUERY_ORDER, {
    fetchPolicy: 'network-only',
    onCompleted: ({ getOrderHistory: { data } }) => {
      const total = data.reduce(
        (total: any, each: any) => {
          total['amount'] = total['amount'] + Number(each.amount)
          total['fees'] = total['fees'] + Number(each.fee)
          total['rate'] = total['rate'] + Number(each.rate)
          return total
        },
        { amount: 0, fees: 0, rate: 0 },
      )

      setOvData({
        totalAmount: total['amount'].toFixed(2),
        totalFees: total['fees'].toFixed(2),
        avgPrice: total['rate'] / data.length,
      })

      const orderData = data.map((e: any, i: number) => {
        return {
          id: i + 1,
          key: e.txn_id,
          amount: <Tag color='green'>{e.amount}</Tag>,
          rate: <Tag color='blue'>{thbCurrency(e.rate)}</Tag>,
          fees: <Tag color='red'>{thbCurrency(e.fee)}</Tag>,
          type: <Tag color='purple'>{e.type}</Tag>,
          hash: e.hash,
          ts: moment.unix(e.ts).format('YYYY/MM/DD, HH:mm'),
          profit: '0%',
        }
      })
      setSymbolData(orderData)
      setIsLoading(false)
    },
  })

  useEffect(() => {
    if (data?.getAvailableSymbols) {
      setValidKey(true)
      setSymbols(data?.getAvailableSymbols)
    }
    if (error) {
      isInvalidKey(error, (isInvalid: boolean) => {
        if (isInvalid) {
          setValidKey(false)
          notification.warn({
            message: 'Invalid key detected',
            description: 'Please setup your key',
          })
          Router.push({ pathname: '/auth/credentials' })
        }
      })
    }
  }, [data, error])

  const styles = {
    cardBody: {
      paddingTop: '5px',
    },
  }

  const onOrderTabChange = (symbol: string) => {
    setIsLoading(true)
    getOrderHistory({
      variables: {
        sym: `THB_${symbol}`,
      },
    })
  }

  return isValidKey ? (
    <div>
      <Card title='Orders' bodyStyle={styles.cardBody}>
        <Tabs defaultActiveKey={symbols[0]} onChange={onOrderTabChange}>
          {symbols.map((sym: string) => {
            return (
              <TabPane tab={sym.replace('THB_', '')} key={sym}>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Table
                    bordered
                    pagination={false}
                    dataSource={symbolData}
                    columns={[
                      { title: '#', dataIndex: 'id', key: 'id', width: '10px' },
                      {
                        title: (
                          <Tooltip
                            placement='topLeft'
                            title={
                              ovData?.totalAmount
                                ? `Total : ${ovData?.totalAmount}`
                                : ''
                            }
                          >
                            Amount
                          </Tooltip>
                        ),
                        dataIndex: 'amount',
                        key: 'amount',
                      },
                      {
                        title: 'Type',
                        dataIndex: 'type',
                        key: 'type',
                        width: '10px',
                        align: 'center',
                      },
                      {
                        title: (
                          <Tooltip
                            placement='topLeft'
                            title={
                              ovData?.avgPrice
                                ? `Average : ${thbCurrency(ovData?.avgPrice)}`
                                : ''
                            }
                          >
                            Rate
                          </Tooltip>
                        ),
                        dataIndex: 'rate',
                        key: 'rate',
                        align: 'center',
                      },
                      {
                        title: (
                          <Tooltip
                            placement='topLeft'
                            title={
                              ovData?.totalFees
                                ? `Total Fees : ${thbCurrency(
                                    ovData?.totalFees,
                                  )}`
                                : ''
                            }
                          >
                            Fees
                          </Tooltip>
                        ),
                        dataIndex: 'fees',
                        key: 'fees',
                        align: 'center',
                      },
                      {
                        title: 'Profit',
                        dataIndex: 'profit',
                        key: 'profit',
                        align: 'center',
                      },
                      { title: 'Executed', dataIndex: 'ts', key: 'ts' },
                    ]}
                  />
                )}
              </TabPane>
            )
          })}
        </Tabs>
      </Card>
    </div>
  ) : (
    <Loader />
  )
}

Orders.getInitialProps = async (ctx: any): Promise<IInitialProps> => {
  const { req, res } = ctx
  const { bptUser, bptToken }: any = Cookies(ctx)
  const redirect = (path: string) => {
    if (res) {
      res.writeHead(302, { Location: path })
      res.end()
    } else {
      Router.push({ pathname: path })
    }
  }
  if (!bptUser?._id) {
    redirect('/auth/login')
  }
  if (bptUser?._id && !bptUser?.validKey) {
    redirect('/auth/credentials')
  }
  return { bptUser, bptToken }
}

export default Orders
