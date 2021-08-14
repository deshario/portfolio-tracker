import { gql } from "apollo-server-express"

const userMutation = gql`

  type Mutation {
    signup(email: String!, password: String!): User
    signin(email: String!, password: String!, remember: Boolean): Auth
    token(email: String!, rtoken: String!): Auth
    signout: User
  }
`
export { userMutation }
