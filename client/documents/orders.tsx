import { gql } from '@apollo/client'

export const QUERY_DEPOSIT_SYMBOLS = gql`
  query getAvailableSymbols {
    getAvailableSymbols
  }
`

export const QUERY_ORDER = gql`
  query getOrderHistory($sym: String!) {
    getOrderHistory(sym: $sym) {
      success
      data {
        txn_id
        order_id
        hash
        type
        rate
        fee
        credit
        amount
        ts
      }
    }
  }
`
