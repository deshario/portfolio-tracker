import { orderController } from './db/order.controller'
import { Order } from '../../../interface'

const orderResolver = {
	Query: {
		getMyOrderHistory (parent: any, args: any, context: any): Promise<Order | any> {
			return orderController.getMyOrderHistory(args);
		}
	},
}

export { orderResolver }