import type { AppProps } from 'next/app'
import TrackerLayout from './components/layout'
import '../styles/antd-global.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TrackerLayout {...pageProps}>
      <Component {...pageProps} />
    </TrackerLayout>
  )
}

export default App