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