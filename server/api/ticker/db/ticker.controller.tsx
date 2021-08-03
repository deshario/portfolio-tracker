import { API_HOST } from '../../../config/handler'
import { Ticker } from '../../../../interface'
import axios from 'axios';

const tickerController = {
  getTickers: async(args:any) => {
    try{
      const { data: result } = await axios.get(`${API_HOST}/api/market/ticker`)
      const tickers:Ticker[] = Object.keys(result).map(key => {
        return {
          symbol:key,
          last: result[key]['last'],
          lowestAsk: result[key]['lowestAsk'],
          highestBid: result[key]['highestBid'],
          percentChange: result[key]['percentChange']
        }
      });
      return tickers;
    }catch(err){
      return []
    }
  }
}

export { tickerController }