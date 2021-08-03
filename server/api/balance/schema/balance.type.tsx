import { gql } from 'apollo-server-express';

const balanceType = gql`

	type Balance {
		available: String
		reserved: String
		symbol: String
		value: String
	}

  type TotalBalance {
		success: Boolean
		balances: [Balance]
	}
	
`;

export { balanceType }