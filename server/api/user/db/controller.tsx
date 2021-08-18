import passport from "passport"
import User, { IUser } from "./model"
import { IQuerys, IId, IAuth, IToken, IContext, BKCredentials, ValidCredentials } from "../../../../interface"
import { refreshToken, signToken, verifyJWT, verifyCredentials, setAuthCookie } from "../../../auth/auth.service"
import { API_HOST, getReqConstructor } from '../../../config/handler'
import axios from 'axios';
import cookieParser from "cookie-parser"

import { setupLocalStrategy } from "../../../auth"

passport.serializeUser((user: any, done: any): void => done(null, user))

passport.deserializeUser((user: any, done: any): void => done(null, user))

setupLocalStrategy(User)

const userController = {

  users: async (args: IQuerys): Promise<IUser[]> => {
    return User.find({}).sort(args.sort || "_id").skip(args.skip || 0).limit(args.limit || 0)
  },

  user: async (user: IId): Promise<IUser | null> => {
    return User.findOne({ _id: user._id })
  },

  signup: async (data: IAuth, context: IContext): Promise<IUser> => {
    const { email, password } = data
    const newUser = new User({ email: email.toLowerCase(), password })
    const user: IUser = await newUser.save()
    return user
  },

  signin: async (payload: IAuth): Promise<IUser> => {
    return new Promise((resolve, reject): void => {
      passport.authenticate("local", async (err: any, user: any, info: any) => {
        const error = err || info
        if (error) return reject(error.message)
        if (!user) return reject("Something went wrong, please try again.")
        const { credentials : { key, secret } } = user
        const { valid } = await verifyCredentials({ key, secret })
        resolve({
          ...user.profile,
          token: signToken(user.payload4Sign, payload.remember),
          rtoken: refreshToken(user),
          validKey : valid
        })
      })
      ({ body: payload })
    })
  },

  token: async (payload: IToken): Promise<IUser | null> => {
    const user = await User.findOne({ email: payload.email, rtoken: payload.rtoken })
    if (!user) throw new Error("E-mail not found.")
    return {
      ...user.profile,
      token: signToken(user.payload4Sign),
      rtoken: user.rtoken
    }
  },

  signout: async (user: IId): Promise<IUser | null> => {
    return User.findOneAndUpdate(
      { _id: user._id },
      { rtoken: "" },
      { new: true }
    )
  },
 
  // Verify Token for Incoming Request
  verifyToken: async (token: string): Promise<any | null> => {
    if (!token) return { authorized: false }
    try {
      const result: any = await verifyJWT(token)
      const user: IUser | null = await User.findById(result._id)
      return user && user;
    } catch (err) {
      return { authorized: false, error: err }
    }
  },

  setCredentials: async (payload: any, context:IContext): Promise<BKCredentials> => {
    try {
      const { key, secret, token } = payload
      const { valid } = await verifyCredentials({ key, secret })
      if(valid){
        const updatedUser = await User.findOneAndUpdate(
          { _id: context?.user?._id },
          { credentials: { key, secret } },
          { new: true }
        )

        if(updatedUser){
          console.log('Setting Cookie Update')
          // setAuthCookie(context.res, token, updatedUser.rtoken, updatedUser)
        }

        return {
          success: updatedUser ? true: false,
          email: updatedUser ? updatedUser?.email : '',
          info: updatedUser ? 'Key Updated' : ''
        }
      }else{
        return { success: false, info: 'Invalid Key' };
      }
    }catch(err){
      return { success: false, info: 'Something went wrong' };
    }
  },
  
  validateCredentials: async (args: any): Promise<ValidCredentials> => {
    const { key, secret } = args
    return verifyCredentials({ key, secret })
  }

}

export default userController