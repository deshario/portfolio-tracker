import { balanceController } from './db/balance.controller'
import { TotalBalance, IContext } from '../../../interface'

const balanceResolver = {
	Query: {
		getBalance(parent: any, args: any, context: IContext): Promise<TotalBalance | any> {
			return balanceController.getBalance(context);
		},
	},
}

export { balanceResolver }