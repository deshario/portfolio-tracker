import { gql } from 'apollo-server-express';

const depositQuery = gql`
  scalar JSON
	extend type Query {
    getFiatDeposit(key: String!, secret: String!): FiatDeposit
	}
`
export { depositQuery }