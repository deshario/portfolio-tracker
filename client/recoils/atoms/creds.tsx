import { atom } from "recoil"

export const credentials = atom({
  key: "isInvalidCreds",
  default: true
})