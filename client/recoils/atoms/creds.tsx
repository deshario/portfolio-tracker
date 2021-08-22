import { atom } from "recoil"
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const credentials = atom({
  key: 'bptCredentialValid',
  default: false,
  effects_UNSTABLE: [
    persistAtom
  ],
})