import { depositController } from './db/deposit.controller'
import { FiatDeposit } from '../../../interface'

const depositResolver = {
	Query: {
		getFiatDeposit(root: any, args: any, context: any): Promise<FiatDeposit | any> {
			return depositController.getFiatDeposit(args, context);
		},
	},
}

export { depositResolver }