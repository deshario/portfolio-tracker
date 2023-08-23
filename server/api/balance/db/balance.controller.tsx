import { API_HOST, getReqConstructor } from '../../../config/handler'
import { tickerController } from '../../ticker/db/ticker.controller'
import { rebuildAuthCookie } from '../../../auth/auth.service'
import { IContext } from '../../../../interface'
import axios from 'axios'
import { orderController } from '../../order/db/order.controller'

const balanceController = {
  getBalance: async (context: IContext) => {
    try {
      if (!context.validKey) {
        rebuildAuthCookie(context, false)
        throw new Error('Invalid key detected')
      }
      const payload = {}
      const { data, headers } = await getReqConstructor({ context, payload })
      const mBalances = axios.post(
        `${API_HOST}/api/market/balances`,
        data,
        headers,
      )
      const mTickers = tickerController.getTickers()
      const [balancesRes, tickersRes] = await Promise.all([mBalances, mTickers])
      const tickersDict = tickersRes.reduce(
        (acc, item) => ({ ...acc, [item.symbol.toLowerCase()]: item }),
        {},
      )
      const balances = balancesRes?.data?.result || []
      const balanceDetail = await Object.entries(balances).reduce(
        async (acc: any, coin: any) => {
          const balances = await acc
          const key = coin[0]
          const value = coin[1]
          if (value?.available > 0) {
            const dictKey = `thb_${key.toLowerCase()}`
            const marketPrice = tickersDict[dictKey]?.last || value?.available
            const order = await orderController.getOrderHistory(
              { sym: dictKey },
              context,
            )
            const currentValue = Number(value.available) * Number(marketPrice)
            const profit =
              ((currentValue - order?.totalBought) / order?.totalBought) * 100
            const marketValue =
              key == 'THB'
                ? Number(value.available) * 1
                : Number(value.available) * Number(marketPrice)
            balances.push({
              ...balances[key],
              symbol: key,
              available: value?.available,
              marketPrice,
              marketValue,
              totalBought: order?.totalBought,
              profitPercent:
                profit == Number.POSITIVE_INFINITY ||
                profit == Number.NEGATIVE_INFINITY
                  ? 0
                  : profit,
            })
          }
          return balances
        },
        Promise.resolve([]),
      )

      const netWorth = balanceDetail.reduce(
        (totalPrice: any, eachItem: any) =>
          totalPrice + Number(eachItem.marketValue),
        0,
      )

      const finalBalances = balanceDetail.map((eachItem: any) => {
        const percent = (eachItem.marketValue / Number(netWorth)) * 100
        return { ...eachItem, holdingPercent: Number(percent).toFixed(2) }
      })

      return {
        success: true,
        netWorth: Number(netWorth).toFixed(2),
        balances: finalBalances,
      }
    } catch (err) {
      throw err
    }
  },
}

export { balanceController }
