import merge  from "lodash/merge";
import { balanceType, balanceQuery }  from "./api/balance/schema";
import { depositType, depositQuery }  from "./api/deposit/schema";
import { tickerType, tickerQuery }  from "./api/ticker/schema";

const schemas = merge([
  balanceType, balanceQuery,
  depositType, depositQuery,
  tickerType, tickerQuery,
]);

export default schemas;