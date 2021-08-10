import { API_HOST, getReqConstructor } from '../../../config/handler'
import axios from 'axios';

const orderController = {
  getMyOrderHistory: async(args:any) => {
    try{
      const { key, secret, sym } = args
      const payload = { sym }
      const { data, headers } = await getReqConstructor({ key, secret, payload });
      const { data: { result : symbolData } } = await axios.post(`${API_HOST}/api/market/my-order-history`, data, headers)
      return { success: true, data: symbolData || [] }
    }catch(err){
      console.log('\nErr : ',err)
      return { success: false, data: [] }
    }
  }
}

export { orderController }