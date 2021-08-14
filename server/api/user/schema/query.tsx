import { gql } from "apollo-server-express"

const userQuery = gql`

  extend type Query {
    users(
      query: String
      where: JSON
      sort: String
      skip: Int
      limit: Int
    ): [User]

    user: User

  }
`

export { userQuery }