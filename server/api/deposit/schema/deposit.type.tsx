import { gql } from 'apollo-server-express';

const depositType = gql`
  
	type FDeposit {
		txn_id: String
		currency: String
		amount: Int
		status: String
		time: String
	}

	type FiatDeposit {
		success: Boolean
		data: [FDeposit]
	}

	type CDeposit {
		currency: String
		hash: String
		amount: String
		address: String
		confirmations: Int
		status: String
		time: String
	}

	type CryptoDeposit {
		success: Boolean
		data: [CDeposit]
	}

	type AllDeposit {
		success: Boolean
		fiat: [FDeposit],
		crypto: [CDeposit]
	}

`;

export { depositType }