import { gql } from 'apollo-server-express'

const orderQuery = gql`
  extend type Query {
    getOrderHistory(sym: String!): Orders
    getAvailableSymbols: [String]
  }
`

export { orderQuery }
