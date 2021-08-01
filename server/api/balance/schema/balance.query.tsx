import { gql } from 'apollo-server-express';

const balanceQuery = gql`
	type Query {
		getBalance(key: String!, secret: String!): TotalBalance
	}
`
export { balanceQuery }