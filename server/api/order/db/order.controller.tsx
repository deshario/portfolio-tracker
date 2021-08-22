import { API_HOST, getReqConstructor } from '../../../config/handler'
import { rebuildAuthCookie } from "../../../auth/auth.service"
import { IContext } from '../../../../interface';
import axios from 'axios';

const orderController = {
  getMyOrderHistory: async(args:any, context:IContext) => {
    try{
      if(!context.validKey){
        rebuildAuthCookie(context,false);
        throw new Error("Invalid key detected");
      }
      const { sym } = args
      const payload = { sym }
      const { data, headers } = await getReqConstructor({ context, payload });
      const { data: { result : symbolData } } = await axios.post(`${API_HOST}/api/market/my-order-history`, data, headers)
      return { success: true, data: symbolData || [] }
    }catch(err){
      throw err
    }
  }
}

export { orderController }