import { atom, DefaultValue } from "recoil"
import { recoilPersist } from 'recoil-persist'

// const { persistAtom } = recoilPersist()

const mStorage = () => {
  return {
    setItem: (key:any, value:any) => {
      const credentials = JSON.parse(value);
      if(localStorage){
        localStorage.setItem(key, JSON.stringify(credentials))
      }
    },
    getItem: (key:any) => {
      if(localStorage){
        const credentials = localStorage.getItem(key);
        if(credentials != null){
          const parsedCredentials = JSON.parse(credentials);
          return JSON.stringify(parsedCredentials)
        }
        return credentials;
      }
      return '';
    },
    clear: () => {
      localStorage.clear();
    },
  }
}

const { persistAtom } = recoilPersist({ key: 'ptCredentials', storage: mStorage() })

// const localStorageEffect = (key:any) => ({setSelf, onSet}:any) => {

//   if(window != undefined){
//     const savedValue = localStorage.getItem(key)
//     if (savedValue != null) {
//       setSelf(JSON.parse(savedValue));
//     }
//   }

//   onSet((newValue:any) => {
//     if(window != undefined){
//       if (newValue instanceof DefaultValue) {
//         localStorage.removeItem(key);
//       } else {
//         localStorage.setItem(key, JSON.stringify(newValue));
//       }
//     }
//   });
// };

export const credentials = atom({
  key: 'bptCredentialValid',
  default: false,
  // effects_UNSTABLE: [
  //   persistAtom
  //   // localStorageEffect('current_user'),
  // ],
})