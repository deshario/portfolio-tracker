import { useMemo } from 'react'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import Cookies from 'next-cookies'

let apolloClient: any

const setHeader = (operation: any, token: string) => {
  operation.setContext(({ headers = {} }: any): any => {
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  })
  return operation
}

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: '/playground',
    credentials: 'same-origin',
  })

  const authLink = new ApolloLink((operation, forward): any => {
    const { bptToken } = Cookies(operation.getContext())
    setHeader(operation, bptToken || '')
    return forward(operation)
  })

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === 'development',
  })
}

export function initializeApollo(initialState = {}) {
  const _apolloClient = apolloClient ?? createApolloClient()
  if (initialState) {
    const existingCache = _apolloClient.extract()
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }
  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient
  return _apolloClient
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
