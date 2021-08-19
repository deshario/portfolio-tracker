import { gql } from '@apollo/client'

export const BALANCE_FRAG = gql`
  fragment TotalBalance on TotalBalance {
    success
    balances{
      symbol
      available
      reserved
      value
    }
  }
`

export const QUERY_BALANCE = gql`
  query getBalance {
    getBalance {
      ...TotalBalance
    }
  }
  ${BALANCE_FRAG}
`