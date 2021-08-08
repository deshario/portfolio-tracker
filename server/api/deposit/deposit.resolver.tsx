import { depositController } from './db/deposit.controller'
import { FiatDeposit, CryptoDeposit, AllDeposit } from '../../../interface'

const depositResolver = {
	Query: {
		getFiatDeposit(parent: any, args: any, context: any): Promise<FiatDeposit | any> {
			return depositController.getFiatDeposit(args);
		},
		getCryptoDeposit(parent: any, args: any, context: any): Promise<CryptoDeposit | any> {
			return depositController.getCryptoDeposit(args);
		},
		getAllDeposit(parent: any, args: any, context: any): Promise<AllDeposit | any> {
			return depositController.getAllDeposit(args);
		},
	},
}

export { depositResolver }