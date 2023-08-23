import { gql } from '@apollo/client'

export const BALANCE_FRAG = gql`
  fragment TotalBalance on TotalBalance {
    success
    netWorth
    balances {
      symbol
      available
      reserved
      totalBought
      marketPrice
      marketValue
      profitPercent
      holdingPercent
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
