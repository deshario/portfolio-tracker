import { API_HOST, getReqConstructor } from '../../../config/handler'
import { balanceController } from '../../balance/db/balance.controller'
import axios from 'axios';

const orderController = {

  getMyOrderHistory: async(args:any) => {
    try{
      const { key, secret, sym } = args
      const payload = { sym }
      const { data, headers } = await getReqConstructor({ key, secret, payload });
      const { data: { result : symbolData } } = await axios.post(`${API_HOST}/api/market/my-order-history`, data, headers)
      return { success: true, data: symbolData || [] }
      
      // const { success:balanceRes, balances:balanceData } = await balanceController.getBalance(args);
      // if(balanceRes){
      //   const allOrders = await Promise.all(
      //     balanceData.map(e => `THB_${e.symbol}`).map(async (sym) => {
      //       const payload = { sym }
      //       const { data, headers } = await getReqConstructor({ key, secret, payload });
      //       const { data: { result : symbolData } } = await axios.post(`${API_HOST}/api/market/my-order-history`, data, headers)
      //       return {
      //         [sym] : symbolData
      //       }
      //     })
      //   );
      //   const groupedOrders = allOrders.reduce((acc:any, x:any) => {
      //     for (const key in x){
      //       acc[key] = x[key]
      //     }
      //     return acc;
      //   }, {});
      //   return { success: true, data: groupedOrders }
      // }
      
    }catch(err){
      console.log('\nErr : ',err)
      return { success: false, data: [] }
    }
  }

}

export { orderController }