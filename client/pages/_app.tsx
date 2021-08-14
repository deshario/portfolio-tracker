import React from 'react'
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil';
import Head from 'next/head'
import TrackerLayout from './components/layout'
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apollo";
import '../styles/antd-global.css'

const App = ({ Component, pageProps }: AppProps) => {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <>
      <Head>
        <title>Portfolio Tracker</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <RecoilRoot>
          <TrackerLayout {...pageProps}>
            <Component {...pageProps} />
          </TrackerLayout>
        </RecoilRoot>
      </ApolloProvider>
    </>
  )
}

export default App