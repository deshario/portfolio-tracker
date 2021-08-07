import { gql } from '@apollo/client'

export const FIAT_DEPOSIT = gql`
  fragment FiatDeposit on FiatDeposit {
    success
    data{
      currency
      amount
      status
      date
      time
    }
  }
`

export const QUERY_FIAT_DEPOSIT = gql`
  query getFiatDeposit($key: String! $secret: String!) {
    getFiatDeposit(key: $key, secret: $secret) {
      ...FiatDeposit
    }
  }
  ${FIAT_DEPOSIT}
`