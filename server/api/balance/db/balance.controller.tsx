import { API_HOST, getReqConstructor, getReqConstructorII } from '../../../config/handler'
import { tickerController } from '../../ticker/db/ticker.controller'
import { IContext } from '../../../../interface';
import axios from 'axios';

const balanceController = {
  getBalance: async(context:IContext) => {
    try{
      if(!context.validKey) throw new Error("Invalid key detected")
      const payload = {}
      const { data, headers } = await getReqConstructorII({ context, payload });
      const mBalances = axios.post(`${API_HOST}/api/market/balances`, data, headers)
      const mTickers = tickerController.getTickers({});
      const [balancesRes, tickersRes] = await Promise.all([mBalances, mTickers]);
      const tickersDict = tickersRes.reduce((acc, item) => ({ ...acc, [item.symbol.toLowerCase()] : item }),{});
      const balances = balancesRes?.data?.result || [];
      const cleanedBalances:any = Object.keys(balances).map(key => {
        const dictKey = `thb_${key.toLowerCase()}`
        return {
          ...balances[key],
          symbol:key,
          value: tickersDict[dictKey]?.last || -1
        }
      }).filter(transaction => transaction.available > 0)
      return { success: true, balances: cleanedBalances }
    }catch(err){
      throw err
    }
  }
}

export { balanceController }