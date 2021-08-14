import express from "express"
import { AuthenticationError } from "apollo-server-express"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import moment from "moment"
import { IUser } from "../api/user/db/model"
import { IContext } from "../../interface"

const JWT_SECRET = "optimus"
const TOKEN_EXPIRE: number = 10
const RTOKEN_EXPIRE: number = TOKEN_EXPIRE * 3
const MAX_AGE: number = (24 * 60 * 60 * 1000) * TOKEN_EXPIRE

export const signToken = (data: IUser, remember?: boolean): string => {
  let expire = TOKEN_EXPIRE
  if (remember) expire = expire * 2
  return jwt.sign(data, JWT_SECRET, { expiresIn: 60 * 60 * 24 * expire })
}

export const refreshToken = (data: IUser): string => {
  const end = moment(data?.updatedAt || data?.createdAt)
  const now = moment()
  let time = end

  if (end) {
    const duration = moment.duration(now.diff(end))
    const days = duration.asDays()
    if (days > RTOKEN_EXPIRE) {
      time = now
    }
  }

  const rtoken: string = crypto
    .pbkdf2Sync(
      `${data._id} ${data.password} ${time.format("YYYY-MM-DD HH:mm:ss")}`,
      JWT_SECRET,
      10000,
      100,
      "sha1"
    )
    .toString("base64")

  if (data.rtoken !== rtoken) {
    data.rtoken = rtoken
    data.save()
  }
  return rtoken
}

export const setAuthCookie = (
  res: express.Response,
  token: string,
  rtoken: string,
  user: any
): express.Response => {
  if (token && rtoken && user) {
    res.cookie("token", token, { maxAge: MAX_AGE })
    res.cookie("rtoken", rtoken, { maxAge: MAX_AGE })
    res.cookie("user", user, { maxAge: MAX_AGE })
  }

  return res
}

export const resetAuthCookie = (res: express.Response): express.Response => {
  res.clearCookie("token")
  res.clearCookie("rtoken")
  res.clearCookie("user")
  return res
}

export const verifyJWT = (token: string): object | string => {
  return jwt.verify(String(token).replace("Bearer ", ""), JWT_SECRET)
}

export const authenticate = (context: IContext): undefined => {
  if (!context.authorized) {
    if (context.error && context.error.message) {
      throw new AuthenticationError(context.error.message)
    } else {
      throw new AuthenticationError("You must be logged in.")
    }
  }
  return
}