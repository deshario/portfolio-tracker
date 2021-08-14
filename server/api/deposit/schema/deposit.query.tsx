import { gql } from 'apollo-server-express';

const depositQuery = gql`
  scalar JSON
	extend type Query {
    getFiatDeposit(key: String!, secret: String!): FiatDeposit
    getCryptoDeposit(key: String!, secret: String!): CryptoDeposit
    getAllDeposit(key: String!, secret: String!): AllDeposit
	}
`

export { depositQuery }