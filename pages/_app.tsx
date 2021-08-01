import React from 'react'
import { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil';
import Head from 'next/head'
import TrackerLayout from './components/layout'
import '../styles/antd-global.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Portfolio Tracker</title>
      </Head>
      <RecoilRoot>
        <TrackerLayout {...pageProps} >
          <Component {...pageProps} />
        </TrackerLayout>
      </RecoilRoot>
    </>
  )
}

export default App