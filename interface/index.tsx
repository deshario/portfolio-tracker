import express from "express"

export interface Balance {
	available: string
	reserved: string
	symbol: string
	value: string
}

export interface TotalBalance {
	success: Boolean
	balances: [Balance]
}

export interface FDeposit {
	txn_id: string
	currency: string
	amount: number
	status: string
	time: string
}

export interface FiatDeposit {
	success: boolean
	data: [FDeposit]
}

export interface CDeposit {
	currency: string
	hash: string
	amount: string
	address: string
	confirmations: number
	status: string
	time: string
}

export interface CryptoDeposit {
	success: boolean
	data: [CDeposit]
}

export interface AllDeposit {
	success: boolean
	fiat: [FDeposit]
	crypto: [CDeposit]
}

export interface Ticker {
	symbol: string
	last: number
	lowestAsk: number
	highestBid: number
	percentChange: string
}

export interface MOrder {
	txn_id: string
	order_id: string
	hash: string
	type: string
	rate: string
	fee: string
	credit: string
	amount: string
	ts: string
}

export interface Order{
	success: Boolean
	data: [MOrder]
}

export interface IQuerys {
  query: string
  where: any
  sort: string
  skip: number
  limit: number
}

export interface IId {
  _id: string
}

export interface IAuth {
  email: string
  password: string
  remember?: boolean
}

export interface IToken {
  email: string
  rtoken: string
}

export interface IContext {
  url?: string
  user?: any
  error?: any
  authorized?: boolean
  req: express.Request
  res: express.Response
}

export interface ReqRes {
  req: express.Request
  res: express.Response
}

export interface BKCredentials {
	success: boolean
	email: string
}

export interface ValidCredentials {
	valid: boolean
}