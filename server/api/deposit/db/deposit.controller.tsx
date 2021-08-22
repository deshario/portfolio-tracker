import { API_HOST, getReqConstructor } from '../../../config/handler'
import { rebuildAuthCookie } from "../../../auth/auth.service"
import { IContext } from '../../../../interface';
import axios from 'axios';

const depositController = {

  getFiatDeposit: async(context:IContext) => {
    try{
      if(!context.validKey){
        rebuildAuthCookie(context,false);
        throw new Error("Invalid key detected");
      }
      const payload = {}
      const { data, headers } = await getReqConstructor({ context, payload });
      const { data: {result:fiatDeposits} } = await axios.post(`${API_HOST}/api/fiat/deposit-history`, data, headers)
      return { success: true, data: fiatDeposits }
    }catch(err){
      throw err
    }
  },

  getCryptoDeposit: async(context:IContext) => {
    try{
      if(!context.validKey){
        rebuildAuthCookie(context,false);
        throw new Error("Invalid key detected");
      }
      const payload = {}
      const { data, headers } = await getReqConstructor({ context, payload });
      const { data: {result:cryptoDeposits} } = await axios.post(`${API_HOST}/api/crypto/deposit-history`, data, headers)
      return { success: true, data: cryptoDeposits }
    }catch(err){
      throw err
    }
  },

  getAllDeposit: async(context:IContext) => {
    try{
      if(!context.validKey){
        rebuildAuthCookie(context,false);
        throw new Error("Invalid key detected");
      }
      const payload = {}
      const { data, headers } = await getReqConstructor({ context, payload });
      const fiatDeposits = axios.post(`${API_HOST}/api/fiat/deposit-history`, data, headers)
      const cryptoDeposits = axios.post(`${API_HOST}/api/crypto/deposit-history`, data, headers)
      const [fiat, crypto] = await Promise.all([fiatDeposits, cryptoDeposits]);
      return {
        success: true,
        fiat: fiat?.data?.result || [],
        crypto: crypto?.data?.result || []
      }
    }catch(err){
      throw err
    }
  }

}

export { depositController }