import { API_HOST, getReqConstructor } from '../../../config/handler'
import { rebuildAuthCookie } from "../../../auth/auth.service"
import { IContext } from '../../../../interface';
import axios from 'axios';

const orderController = {
  getOrderHistory: async(args:any, context:IContext) => {
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
  },
  getAvailableSymbols: async(context:IContext) => {
    try{
      if(!context.validKey){
        rebuildAuthCookie(context,false);
        throw new Error("Invalid key detected");
      }
      const payload = {}
      const { data, headers } = await getReqConstructor({ context, payload });
      const { data : { result } } = await axios.post(`${API_HOST}/api/market/balances`, data, headers)
      const symbols = Object.keys(result).reduce((symbols:string[], symbol:string) => {
        if(result[symbol]?.available > 0){
          symbols.push(symbol)
        }
        return symbols;
      },[]);
      return symbols;
    }catch(err){
      throw err
    }
  }
}

export { orderController }