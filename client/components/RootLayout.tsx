import React from 'react'
import AuthLayout from './AuthLayout';
import TrackerLayout from './TrackerLayout';

const RootLayout = (props:any) => {
  return props?.bptUser?.validKey ? <TrackerLayout {...props}/> : <AuthLayout {...props}/>
}

export default RootLayout