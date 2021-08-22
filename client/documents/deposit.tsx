import { gql } from '@apollo/client'

export const FIAT_DEPOSIT = gql`
  fragment FiatDeposit on FiatDeposit {
    success
    data{
      txn_id
      currency
      amount
      status
      time
    }
  }
`

export const ALL_DEPOSIT = gql`
  fragment AllDeposit on AllDeposit {
    success
    crypto{
      currency
      hash
      amount
      address
      confirmations
      status
      time
    }
    fiat{
      txn_id
      currency
      amount
      status
      time
    }
  }
`

export const QUERY_FIAT_DEPOSIT = gql`
  query getFiatDeposit {
    getFiatDeposit{
      ...FiatDeposit
    }
  }
  ${FIAT_DEPOSIT}
`

export const QUERY_ALL_DEPOSIT = gql`
  query getAllDeposit{
    getAllDeposit{
      ...AllDeposit
    }
  }
  ${ALL_DEPOSIT}
`