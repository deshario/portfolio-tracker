import { API_HOST, createPayload, createSignature, createHeader } from '../../../config/handler'
import { FDeposit, FiatDeposit } from '../../../../interface'
import axios from 'axios';
import moment from 'moment';

const depositController = {
  getFiatDeposit: async(args:any, context:any) => {
    try{
      const { key, secret } = args
      const payloadData = {}
      const payload = await createPayload(payloadData);
      const signatureHash = createSignature(payload,secret);
      const data = { sig:signatureHash, ...payload }
      const headers = createHeader(key);
      const { data: {result:fiatDeposits} } = await axios.post(`${API_HOST}/api/fiat/deposit-history`, data, headers)
      const fiatDepoitsOk:[FDeposit] = fiatDeposits.map(e => {
        return {
          ...e,
          date: moment.unix(e.time).format("ll"),
          time: moment.unix(e.time).format("LT"),
        }
      });
      const totalBalances:FiatDeposit = { success: true, data: fiatDepoitsOk }
      return totalBalances
    }catch(err){
      return { success: false, data: [] }
    }
  }
}

export { depositController }