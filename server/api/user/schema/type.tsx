import { gql } from "apollo-server-express"

const userType = gql`
  scalar ObjectID
  scalar Date

  type User {
    _id: ObjectID!
    email: String!
    name: String
    provider: String
  }

  type Auth {
    _id: ObjectID
    email: String
    name: String
    provider: String
    token: String
    rtoken: String
    createdAt: Date
    updatedAt: Date
  }

  type bkCredentials {
    success: Boolean
    email: String
  }

  type validCredentials {
    valid: Boolean
  }

`

export { userType }
