import dotenv from 'dotenv'
import fs from 'fs'

const env = String(process.env.NODE_ENV) === 'production' ? 'prod' : 'dev'
const envFile: string = `.${env}`

if (fs.existsSync(envFile) && String(process.env.NODE_ENV) !== 'test') {
  console.log(
    '\x1b[36m%s\x1b[0m',
    `info - Using ${envFile} file to supply config environment variables`,
  )
  dotenv.config({ path: envFile })
} else {
  console.log('\x1b[31m', '>> NO ENV DEFINED <<')
}

export const NODE_ENV: string = process.env.NODE_ENV || 'development'
export const HOSTNAME: string = process.env.HOSTNAME || 'localhost'
export const PORT: string = process.env.PORT || '3000'
export const MONGO_URL: string = process.env.MONGO_URL || ''
export const JWT_SECRET: string = process.env.JWT_SECRET || ''
