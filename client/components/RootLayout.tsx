import React from 'react'
import AuthLayout from './AuthLayout'
import TrackerLayout from './TrackerLayout'
import { useRecoilValue } from 'recoil'
import { credentials } from '../recoils/atoms'

const RootLayout = (props: any) => {
  const isValidCredential = useRecoilValue(credentials)
  const isValidKey = props?.bptUser?.validKey || isValidCredential
  return isValidKey ? <TrackerLayout {...props} /> : <AuthLayout {...props} />
}

export default RootLayout
