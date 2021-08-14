import passport from "passport"
import User, { IUser } from "./model"
import { IQuerys, IId, IAuth, IToken, IContext } from "../../../../interface"
import { refreshToken, signToken, verifyJWT } from "../../../auth/auth.service"

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

  signin: async (data: IAuth, context: IContext): Promise<IUser> => {
    return new Promise((resolve, reject): void => {
      passport.authenticate("local", (err: any, user: any, info: any) => {
        const error = err || info
        if (error) return reject(error.message)
        if (!user) return reject("Something went wrong, please try again.")
        resolve({
          ...user.profile,
          token: signToken(user.payload4Sign, data.remember),
          rtoken: refreshToken(user)
        })
      })
      ({ body: data })
    })
  },

  token: async (data: IToken): Promise<IUser | null> => {
    const user = await User.findOne({ email: data.email, rtoken: data.rtoken })
    if (!user) {
      throw new Error("E-mail not found.")
    }
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
  }

}

export default userController