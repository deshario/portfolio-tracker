import { createHmac } from 'crypto';
import axios from 'axios';

export const API_HOST = "https://api.bitkub.com"

export const createPayload = async (payload = {}) => {
  const { data: servertime } = await axios.get(`${API_HOST}/api/servertime`);
  return {
    ts: servertime,
    ...payload
  };
}

export const createSignature = (payload:any, secret:string) => {
  return createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex");
}

export const createHeader = (key:string) => {
  return {
    headers : {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-BTK-APIKEY': key
    }
  }
}

export const getReqConstructor = async ({ key, secret, payload }) => {
  const bPayload = await createPayload(payload)
  const signatureHash = createSignature(bPayload,secret);
  const data = { sig:signatureHash, ...bPayload }
  const headers = createHeader(key);
  return { data, headers }
}