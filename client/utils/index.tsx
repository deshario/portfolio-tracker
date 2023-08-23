import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
const iv = crypto.randomBytes(16)

export const encrypt = (text: any) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}

export const decrypt = (hash: any) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex'),
  )
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ])
  return decrpyted.toString()
}

export const getCoinSymbolIcon = (symbol: String) => {
  return symbol.toLowerCase() == 'kub'
    ? 'https://www.gofx.com/wp-content/uploads/2021/06/Bitkub-Coin.png'
    : `https://www.bitkub.com/static/images/icons/${symbol}.png`
}

export const getCoinInfo = (key: string, getLink: boolean) => {
  const bkCoins: any = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    WAN: 'wanchain',
    ADA: 'cardano',
    OMG: 'omg',
    BCH: 'bitcoin-cash',
    LTC: 'litecoin',
    USDT: 'tether',
    XRP: 'xrp',
    IOST: 'iostoken',
    SNT: 'status',
    CVC: 'civic',
    ZIL: 'zilliqa',
    LINK: 'chainlink',
    ZRX: '0x',
    KNC: 'kyber-network-crystal-v2',
    ENG: 'enigma',
    RDN: 'raiden-network-token',
    ABT: 'arcblock',
    MANA: 'decentraland',
    CTXC: 'cortex',
    INF: 'infinitus-token',
    SIX: 'six',
    XLM: 'stellar',
    JFIN: 'jfin',
    BNB: 'binance-coin',
    DOGE: 'dogecoin',
    EVX: 'everex',
    DAI: 'multi-collateral-dai',
    BAND: 'band-protocol',
    DOT: 'polkadot-new',
    KSM: 'kusama',
    USDC: 'usd-coin',
    BAT: 'basic-attention-token',
    NEAR: 'near-protocol',
    DON: 'donnie-finance',
    MKR: 'maker',
    COMP: 'compound',
    AAVE: 'aave',
    UNI: 'uniswap',
    YFI: 'yearn-finance',
    ALPHA: 'alpha-finance-lab',
    ENJ: 'enjin-coin',
    CRV: 'curve-dao-token',
    BAL: 'balancer',
    MATIC: 'polygon',
    KUB: 'bitkub',
  }
  const coinAlias =
    bkCoins[key] ||
    bkCoins[key.toLowerCase()] ||
    bkCoins[key.toUpperCase()] ||
    ''
  return !getLink
    ? coinAlias
    : getLink && coinAlias == 'bitkub'
    ? 'https://www.bitkub.com/blog/bitkub-coin-2c4177fc03ea'
    : `https://coinmarketcap.com/currencies/${coinAlias}`
}

export const thbCurrency = (amount: number | string) => {
  let amountNum = typeof amount == 'string' ? Number(amount) : amount
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(amountNum)
    .replace('$', '฿')
}

export const isInvalidKey = (error: any, callback: Function) => {
  const isInvalid = `${error}`.includes('Invalid key')
  callback(isInvalid)
}

export const formatCash = (n: any) => {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
}
