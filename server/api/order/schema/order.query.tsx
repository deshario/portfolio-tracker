import { gql } from 'apollo-server-express';

const orderQuery = gql`
	extend type Query {
    getMyOrderHistory(key: String!, secret: String! sym:String!): Orders
	}
`
export { orderQuery }