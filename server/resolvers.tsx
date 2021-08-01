import merge from "lodash/merge";
import { balanceResolver } from "./api/balance/balance.resolver";
import { depositResolver } from "./api/deposit/deposit.resolver";

const resolvers = merge([
  balanceResolver,
  depositResolver
]);

export default resolvers