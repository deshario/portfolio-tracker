import { gql } from 'apollo-server-express';

const balanceType = gql`

	type Balance {
		available: String
		reserved: String
		symbol: String
		marketPrice: String
		marketValue: String
		totalBought: String
    profitPercent: String
		holdingPercent: String
	}

  type TotalBalance {
		success: Boolean
		netWorth: String
		balances: [Balance]
	}
	
`;

export { balanceType }