import { gql } from 'apollo-server-express';

const tickerType = gql`
	type Ticker {
		symbol: String
		last: Float
    lowestAsk: Float
    highestBid: Float
    percentChange: String
  }
`;

export { tickerType }