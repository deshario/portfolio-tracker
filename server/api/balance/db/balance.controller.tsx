import axios from 'axios';
import { TotalBalance } from '../../../../interface'
import { API_HOST, createPayload, createSignature, createHeader } from '../../../config/handler'

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
      const availableBalances:any = Object.keys(balances).map(key => ({...balances[key], symbol:key})).filter(transaction => transaction.available > 0)
      const totalBalances:TotalBalance = { success: true, balances: availableBalances }
      return totalBalances;
    }catch(err){
      return { success: false, balances: [] }
    }
  }
}

export { balanceController }