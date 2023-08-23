import { tickerController } from './db/ticker.controller'
import { Ticker } from '../../../interface'

const tickerResolver = {
  Query: {
    getTickers(parent: any, args: any, context: any): Promise<Ticker[] | any> {
      return tickerController.getTickers()
    },
  },
}

export { tickerResolver }
