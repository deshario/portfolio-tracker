import axios from 'axios';
import { TotalBalance } from '../../../../interface'
import { API_HOST, createPayload, createSignature, createHeader } from '../../../config/handler'
import { tickerController } from '../../ticker/db/ticker.controller'

const balanceController = {
  getBalance: async(args:any, context:any) => {
    try{
      const { key, secret } = args
      const payloadData = {}
      const payload = await createPayload(payloadData);
      const signatureHash = createSignature(payload,secret);
      const data = { sig:signatureHash, ...payload }
      const headers = createHeader(key);
      const { data:{result:balances} } = await axios.post(`${API_HOST}/api/market/balances`, data, headers)
      const tickers = await tickerController.getTickers({});
      const tickersDict = tickers.reduce((acc, item) => ({ ...acc, [item.symbol.toLowerCase()] : item }),{});
      const mBalances:any = Object.keys(balances).map(key => {
        const dictKey = `thb_${key.toLowerCase()}`
        return {
          ...balances[key],
          symbol:key,
          value: tickersDict[dictKey]?.last || -1
        }
      }).filter(transaction => transaction.available > 0)
      const totalBalances:TotalBalance = { success: true, balances: mBalances }
      return totalBalances;
    }catch(err){
      return { success: false, balances: [] }
    }
  }
}

export { balanceController }