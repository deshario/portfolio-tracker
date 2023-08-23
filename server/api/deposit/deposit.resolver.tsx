import { depositController } from './db/deposit.controller'
import {
  FiatDeposit,
  CryptoDeposit,
  AllDeposit,
  IContext,
} from '../../../interface'

const depositResolver = {
  Query: {
    getFiatDeposit(
      parent: any,
      args: any,
      context: IContext,
    ): Promise<FiatDeposit | any> {
      return depositController.getFiatDeposit(context)
    },
    getCryptoDeposit(
      parent: any,
      args: any,
      context: IContext,
    ): Promise<CryptoDeposit | any> {
      return depositController.getCryptoDeposit(context)
    },
    getAllDeposit(
      parent: any,
      args: any,
      context: IContext,
    ): Promise<AllDeposit | any> {
      return depositController.getAllDeposit(context)
    },
  },
}

export { depositResolver }
