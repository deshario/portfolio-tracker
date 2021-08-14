import userController from "./db/controller"
import {
  authenticate,
  resetAuthCookie,
  setAuthCookie
} from "../../auth/auth.service"
import { IUser } from "./db/model"
import {
  IAuth,
  IContext,
  IId,
  IQuerys,
  IToken
} from "../../../interface"

const userResolver = {
  Query: {
    users(root: any, args: IQuerys, context: IContext): Promise<IUser[] | null> {
      authenticate(context)
      return userController.users(args)
    },
    user(root: any, args: IId, context: IContext): Promise<IUser | null> {
      authenticate(context)
      return userController.user(context.user)
    },
  },
  Mutation: {
    signup(parent: any, args: IAuth, context: IContext): Promise<IUser | null> {
      return userController.signup(args, context)
    },

    async signin(root: any, args: IAuth, context: any): Promise<IUser | null> {
      const result: IUser | null = await userController.signin(args, context)
      .catch((err) => {
        throw new Error(err)
      })

      if(result) {
        setAuthCookie(context.res, result.token, result.rtoken, result)
      }
      return result
    },

    async signout(parent: any, args: {}, context: IContext): Promise<IUser | null> {
      authenticate(context)
      resetAuthCookie(context.res)
      const result: IUser | null = await userController.signout(context.user)
      return result
    },
   
    async token(root: any, args: IToken, context: IContext): Promise<IUser | null> {
      const result = await userController.token(args)
      if(result) {
        setAuthCookie(context.res, result.token, result.rtoken, result)
      }
      return result
    },
    
  }
}

export { userResolver }
