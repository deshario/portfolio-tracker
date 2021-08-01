export interface Balance {
	available: String
	reserved: String
	symbol: String 
}

export interface TotalBalance {
	success: Boolean
	balances: [Balance]
}

export interface FDeposit {
	currency: String
	amount: number
	status: String
	time: String
	date: String
}

export interface FiatDeposit {
	success: Boolean
	data: [FDeposit]
}