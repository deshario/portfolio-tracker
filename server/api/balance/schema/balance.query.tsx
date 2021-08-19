import { gql } from 'apollo-server-express';

const balanceQuery = gql`
	extend type Query {
		getBalance: TotalBalance
	}
`

export { balanceQuery }