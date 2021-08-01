import merge  from "lodash/merge";
import { balanceType, balanceQuery }  from "./api/balance/schema";
import { depositType, depositQuery }  from "./api/deposit/schema";

const schemas = merge([
  balanceType, balanceQuery,
  depositType, depositQuery
]);

export default schemas;