import { IUser } from "./db/model"
import userController from "./db/controller"
import { authenticate, resetAuthCookie, setAuthCookie } from "../../auth/auth.service"
import { IAuth, IContext, IId, IQuerys, IToken, BKCredentials, ValidCredentials } from "../../../interface"

const userResolver = {
  Query: {
    users(parent: any, args: IQuerys, context: IContext): Promise<IUser[] | null> {
      return userController.users(args)
    },
    user(parent: any, args: IId, context: IContext): Promise<IUser | null> {
      return userController.user(context.user)
    },
  },
  Mutation: {
    signup(parent: any, payload: IAuth, context: IContext): Promise<IUser | null> {
      return userController.signup(payload, context)
    },
    async signin(parent: any, payload: IAuth, context: any): Promise<IUser | null> {
      try{
        const result: IUser | null = await userController.signin(payload)
        if(result) setAuthCookie(context.res, result.token, result.rtoken, result)
      return result
      }catch(err){
        throw new Error(err)
      }
    },
    async signout(parent: any, payload: {}, context: IContext): Promise<IUser | null> {
      authenticate(context)
      resetAuthCookie(context.res)
      const result: IUser | null = await userController.signout(context.user)
      return result
    },
    async token(parent: any, payload: IToken, context: IContext): Promise<IUser | null> {
      const result = await userController.token(payload)
      if(result) {
        setAuthCookie(context.res, result.token, result.rtoken, result)
      }
      return result
    },
    validateCredentials(parent: any, payload: any, context: IContext): Promise<ValidCredentials> {
      authenticate(context);
      return userController.validateCredentials(payload);
    },
    setCredentials(parent: any, payload: any, context: IContext): Promise<BKCredentials> {
      authenticate(context);
      return userController.setCredentials(payload, context);
    }
  }
}

export { userResolver }