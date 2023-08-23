import merge from 'lodash/merge'
import { balanceType, balanceQuery } from './api/balance/schema'
import { depositType, depositQuery } from './api/deposit/schema'
import { tickerType, tickerQuery } from './api/ticker/schema'
import { orderType, orderQuery } from './api/order/schema'
import { userType, userQuery, userMutation } from './api/user/schema'

const schemas = merge([
  balanceType,
  balanceQuery,
  depositType,
  depositQuery,
  tickerType,
  tickerQuery,
  orderType,
  orderQuery,
  userType,
  userQuery,
  userMutation,
])

export default schemas
