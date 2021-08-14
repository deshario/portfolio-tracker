import { gql } from 'apollo-server-express';

const tickerQuery = gql`
	extend type Query {
    getTickers(key: String!, secret: String!): [Ticker]
	}
`

export { tickerQuery }