import { atom } from "recoil"
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const overview = atom({
  key: 'overview',
  default: {
    netWorth: 0,
    totalFiatDeposit: 0
  },
  // effects_UNSTABLE: [
  //   persistAtom
  // ],
})