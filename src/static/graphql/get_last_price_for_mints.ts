import { gql } from "graphql-tag";

export const GET_LAST_PRICE_FOR_MINTS = gql`
  query MyQuery($asset_mint: String!, $currency_mint: String!) {
    trades(
      limit: 1
      order_by: { timestamp: desc }
      where: {
        _and: [
          { asset_mint: { _eq: $asset_mint } }
          { currency_mint: { _eq: $currency_mint } }
        ]
      }
    ) {
      asset_mint
      currency_mint
      price
      timestamp
    }
  }
`;
