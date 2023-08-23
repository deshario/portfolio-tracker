import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apollo'
import RootLayout from '../components/RootLayout'
import '../styles/antd-global.css'

const App = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <>
      <Head>
        <title>Portfolio Tracker</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <ApolloProvider client={apolloClient}>
        <RecoilRoot>
          <RootLayout {...pageProps}>
            <Component {...pageProps} />
          </RootLayout>
        </RecoilRoot>
      </ApolloProvider>
    </>
  )
}

export default App
