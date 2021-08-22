import { gql } from 'apollo-server-express';

const orderQuery = gql`
	extend type Query {
    getMyOrderHistory(sym:String!): Orders
	}
`

export { orderQuery }