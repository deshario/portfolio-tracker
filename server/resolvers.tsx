import merge from "lodash/merge";
import { balanceResolver } from "./api/balance/balance.resolver";
import { depositResolver } from "./api/deposit/deposit.resolver";
import { tickerResolver } from "./api/ticker/ticker.resolver";
import { orderResolver } from "./api/order/order.resolver";
import { userResolver } from "./api/user/user.resolver";

const resolvers = merge([
  balanceResolver,
  depositResolver,
  tickerResolver,
  orderResolver,
  userResolver
]);

export default resolvers