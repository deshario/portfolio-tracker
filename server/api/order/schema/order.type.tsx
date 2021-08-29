import { gql } from 'apollo-server-express';

const orderType = gql`
  
	type MOrder {
		txn_id: String
		order_id: String
		hash: String
		type: String
		rate: String
		fee: String
		credit: String
		amount: String
		ts: String
	}

	type Orders {
		success: Boolean
		totalBought: String
		data: [MOrder]
	}

	type AvailableOrders {
		symbol: String
	}

`;

export { orderType }