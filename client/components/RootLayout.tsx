import React from 'react'
import AuthLayout from './AuthLayout';
import TrackerLayout from './TrackerLayout';
import { useRecoilValue } from 'recoil';
import { credentials } from '../recoils/atoms'

const RootLayout: React.FC<{ bptUser: any }> = (props) => {

  const isInvalidCreds = useRecoilValue(credentials);
  return props?.bptUser?.validKey && !isInvalidCreds ? <TrackerLayout {...props}/> : <AuthLayout {...props}/>
}

export default RootLayout