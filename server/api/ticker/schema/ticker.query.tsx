import { gql } from 'apollo-server-express'

const tickerQuery = gql`
  extend type Query {
    getTickers: [Ticker]
  }
`

export { tickerQuery }
