import { orderController } from './db/order.controller'
import { Order, IContext } from '../../../interface'

const orderResolver = {
  Query: {
    getOrderHistory(
      parent: any,
      args: any,
      context: IContext,
    ): Promise<Order | any> {
      return orderController.getOrderHistory(args, context)
    },
    getAvailableSymbols(
      parent: any,
      args: any,
      context: IContext,
    ): Promise<String[] | any> {
      return orderController.getAvailableSymbols(context)
    },
  },
}

export { orderResolver }
