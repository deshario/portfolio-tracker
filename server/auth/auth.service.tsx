import express from 'express'
import { AuthenticationError } from 'apollo-server-express'
import { IUser } from '../api/user/db/model'
import { IContext } from '../../interface'
import { API_HOST, getPureReqConstructor } from '../config/handler'
import { JWT_SECRET } from '../config/environment'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import moment from 'moment'

const TOKEN_EXPIRE: number = 10
const RTOKEN_EXPIRE: number = TOKEN_EXPIRE * 3
const MAX_AGE: number = 24 * 60 * 60 * 1000 * TOKEN_EXPIRE

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
      `${data._id} ${data.password} ${time.format('YYYY-MM-DD HH:mm:ss')}`,
      JWT_SECRET,
      10000,
      100,
      'sha1',
    )
    .toString('base64')

  if (data.rtoken !== rtoken) {
    data.rtoken = rtoken
    data.save()
  }
  return rtoken
}

export const verifyCredentials = async ({ key, secret }) => {
  try {
    const payload = { lmt: 1 }
    const { data, headers } = await getPureReqConstructor({
      key,
      secret,
      payload,
    })
    const fiatDeposits = await axios.post(
      `${API_HOST}/api/fiat/deposit-history`,
      data,
      headers,
    )
    const isValidConnection = fiatDeposits?.data?.error == 0
    return { valid: isValidConnection }
  } catch (err) {
    return { valid: false }
  }
}

export const setAuthCookie = (
  res: express.Response,
  token: string,
  rtoken: string,
  user: any,
): express.Response => {
  if (token && rtoken && user) {
    res.cookie('bptToken', token, { maxAge: MAX_AGE })
    res.cookie('bptRtoken', rtoken, { maxAge: MAX_AGE })
    res.cookie('bptUser', user, { maxAge: MAX_AGE })
  }
  return res
}

export const rebuildAuthCookie = (
  context: IContext,
  isValid: boolean,
): express.Response => {
  const getCookie = (cookie, name) => {
    const parts = cookie.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  const getUserFromCookie = () => {
    try {
      const mCookie = getCookie(context.req.headers.cookie, 'bptUser')
      const bptUserCookie = decodeURIComponent(mCookie).slice(2)
      return JSON.parse(bptUserCookie)
    } catch (err) {
      return null
    }
  }
  const user = getUserFromCookie()
  if (context.res && user) {
    user.validKey = isValid
    context.res.cookie('bptUser', user, { maxAge: MAX_AGE })
  }
  return context.res
}

export const resetAuthCookie = (res: express.Response): express.Response => {
  res.clearCookie('bptToken')
  res.clearCookie('bptRtoken')
  res.clearCookie('bptUser')
  return res
}

export const verifyJWT = (token: string): object | string => {
  return jwt.verify(String(token).replace('Bearer ', ''), JWT_SECRET)
}

export const authenticate = (context: IContext): undefined => {
  if (!context.authorized) {
    if (context.error && context.error.message) {
      throw new AuthenticationError(context.error.message)
    } else {
      throw new AuthenticationError('You must be logged in.')
    }
  }
  return
}
