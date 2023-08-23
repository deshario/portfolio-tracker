import type { NextApiRequest, NextApiResponse } from 'next'
import { createHmac } from 'crypto'
import axios from 'axios'
// import moment from 'moment';

const API_HOST = 'https://api.bitkub.com'
// const API_KEY = "fcac6db5f065376c42a74e3cfd628942"
// const API_SCRET = "706fb201ebef47e4c9135c59401cde2a"

const createPayload = async (payload = {}) => {
  const { data: servertime } = await axios.get(`${API_HOST}/api/servertime`)
  return {
    ts: servertime,
    ...payload,
  }
}

const createSignature = (payload: any, secret: string) => {
  return createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')
}

const getHeader = (key: string) => {
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-BTK-APIKEY': key,
    },
  }
}

type Balances = { available: any; reserved: any; symbol: any }

type TotalBalances = { success: boolean; balances: Balances[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TotalBalances>,
) {
  const { key, secret } = req.body
  try {
    const payloadData = {}
    const payload = await createPayload(payloadData)
    const signatureHash = createSignature(payload, secret)
    const data = { sig: signatureHash, ...payload }
    const headers = getHeader(key)
    const {
      data: { result: balances },
    } = await axios.post(`${API_HOST}/api/market/balances`, data, headers)
    const availableBalances: Balances[] = Object.keys(balances)
      .map((key) => ({ ...balances[key], symbol: key }))
      .filter((transaction) => transaction.available > 0)
    res.status(200).send({ success: true, balances: availableBalances })
  } catch (err) {
    res.status(200).send({ success: false, balances: [] })
  }
}
