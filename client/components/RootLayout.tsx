import React from 'react'
import AuthLayout from './AuthLayout';
import TrackerLayout from './TrackerLayout';

const RootLayout: React.FC<{ user: any }> = (props) => {
  return props?.user?.validKey ? <TrackerLayout {...props}/> : <AuthLayout {...props}/>
}

export default RootLayout