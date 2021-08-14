import { gql } from 'apollo-server-express';

const balanceQuery = gql`
	extend type Query {
		getBalance(key: String!, secret: String!): TotalBalance
	}
`

export { balanceQuery }