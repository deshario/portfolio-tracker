import { gql } from 'apollo-server-express';

const depositQuery = gql`
  scalar JSON
	extend type Query {
    getFiatDeposit: FiatDeposit
    getCryptoDeposit: CryptoDeposit
    getAllDeposit: AllDeposit
	}
`

export { depositQuery }