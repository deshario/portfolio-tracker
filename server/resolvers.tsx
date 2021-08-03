import merge from "lodash/merge";
import { balanceResolver } from "./api/balance/balance.resolver";
import { depositResolver } from "./api/deposit/deposit.resolver";
import { tickerResolver } from "./api/ticker/ticker.resolver";

const resolvers = merge([
  balanceResolver,
  depositResolver,
  tickerResolver
]);

export default resolvers