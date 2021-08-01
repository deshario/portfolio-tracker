import { gql } from 'apollo-server-express';

const depositType = gql`
  
	type FDeposit {
		currency: String
		amount: Int
		status: String
		time: String
		date: String
	}

	type FiatDeposit {
		success: Boolean
		data: [FDeposit]
	}

`;

export { depositType }