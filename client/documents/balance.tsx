import { gql } from '@apollo/client'

export const BALANCE_FRAG = gql`
  fragment TotalBalance on TotalBalance {
    success
    balances{
      symbol
      available
      reserved
    }
  }
`

export const QUERY_BALANCE = gql`
  query getBalance($key: String! $secret: String!) {
    getBalance(key: $key, secret: $secret) {
      ...TotalBalance
    }
  }
  ${BALANCE_FRAG}
`