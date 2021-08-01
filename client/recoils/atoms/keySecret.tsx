import { atom } from "recoil"
import { recoilPersist } from 'recoil-persist'
import { encrypt, decrypt }  from '../../utils'

const mStorage = () => {
  return {
    setItem: (key:any, value:any) => {
      const credentials = JSON.parse(value);
      credentials.keySecret.btKey = encrypt(credentials.keySecret.btKey);
      credentials.keySecret.btSecret = encrypt(credentials.keySecret.btSecret);
      localStorage.setItem(key, JSON.stringify(credentials))
    },
    getItem: (key:any) => {
      const credentials = localStorage.getItem(key);
      if(credentials != null){
        const parsedCredentials = JSON.parse(credentials);
        parsedCredentials.keySecret.btKey = decrypt(parsedCredentials.keySecret.btKey);
        parsedCredentials.keySecret.btSecret = decrypt(parsedCredentials.keySecret.btSecret);
        return JSON.stringify(parsedCredentials)
      }
      return credentials;
    },
    clear: () => {
      localStorage.clear();
    },
  }
}

const { persistAtom } = recoilPersist({ key: 'ptCredentials', storage: mStorage() })

export const keySecret = atom({
  key: "keySecret",
  default: {
    btKey : '',
    btSecret : ''
  },
  effects_UNSTABLE: [persistAtom],
})