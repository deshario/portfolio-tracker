import { orderController } from './db/order.controller'
import { Order, IContext } from '../../../interface'

const orderResolver = {
	Query: {
		getMyOrderHistory (parent: any, args: any, context: IContext): Promise<Order | any> {
			return orderController.getMyOrderHistory(args,context);
		}
	},
}

export { orderResolver }