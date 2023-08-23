import { gql } from '@apollo/client'

export const FUSER = gql`
  fragment User on User {
    _id
    email
    name
    provider
  }
`

export const FAUTH = gql`
  fragment Auth on Auth {
    _id
    email
    name
    validKey
    provider
    createdAt
    updatedAt
    token
    rtoken
  }
`

export const SIGNIN = gql`
  mutation signin($email: String!, $password: String!, $remember: Boolean) {
    signin(email: $email, password: $password, remember: $remember) {
      ...Auth
    }
  }
  ${FAUTH}
`

export const SIGNUP = gql`
  mutation signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      ...User
    }
  }
  ${FUSER}
`

export const SIGNOUT = gql`
  mutation signout {
    signout {
      ...User
    }
  }
  ${FUSER}
`

export const SetCredentials = gql`
  mutation setCredentials($key: String!, $secret: String!, $token: String!) {
    setCredentials(key: $key, secret: $secret, token: $token) {
      success
      info
      email
    }
  }
`
