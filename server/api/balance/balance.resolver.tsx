import { balanceController } from './db/balance.controller'
import { TotalBalance } from '../../../interface'

const balanceResolver = {
	Query: {
		getBalance(root: any, args: any, context: any): Promise<TotalBalance | any> {
			return balanceController.getBalance(args,context);
		},
	},
}

export { balanceResolver }