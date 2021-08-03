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
	currency: string
	amount: number
	status: string
	time: string
	date: string
}

export interface FiatDeposit {
	success: Boolean
	data: [FDeposit]
}

export interface Ticker {
	symbol: string
	last: number
	lowestAsk: number
	highestBid: number
	percentChange: string
}