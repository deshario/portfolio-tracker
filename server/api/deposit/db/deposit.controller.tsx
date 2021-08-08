import { API_HOST, getReqConstructor } from '../../../config/handler'
import axios from 'axios';

const depositController = {

  getFiatDeposit: async(args:any) => {
    try{
      const payload = {}
      const { key, secret } = args
      const { data, headers } = await getReqConstructor({ key, secret, payload });
      const { data: {result:fiatDeposits} } = await axios.post(`${API_HOST}/api/fiat/deposit-history`, data, headers)
      return { success: true, data: fiatDeposits }
    }catch(err){
      return { success: false, data: [] }
    }
  },

  getCryptoDeposit: async(args:any) => {
    try{
      const payload = {}
      const { key, secret } = args
      const { data, headers } = await getReqConstructor({ key, secret, payload });
      const { data: {result:cryptoDeposits} } = await axios.post(`${API_HOST}/api/crypto/deposit-history`, data, headers)
      return { success: true, data: cryptoDeposits }
    }catch(err){
      return { success: false, data: [] }
    }
  },

  getAllDeposit: async(args:any) => {
    try{
      const payload = {}
      const { key, secret } = args
      const { data, headers } = await getReqConstructor({ key, secret, payload });
      const fiatDeposits = axios.post(`${API_HOST}/api/fiat/deposit-history`, data, headers)
      const cryptoDeposits = axios.post(`${API_HOST}/api/crypto/deposit-history`, data, headers)
      const [fiat, crypto] = await Promise.all([fiatDeposits, cryptoDeposits]);
      return {
        success: true,
        fiat: fiat?.data?.result || [],
        crypto: crypto?.data?.result || []
      }
    }catch(err){
      return { success: false, fiat: [], crypto:[] }
    }
  }

}

export { depositController }