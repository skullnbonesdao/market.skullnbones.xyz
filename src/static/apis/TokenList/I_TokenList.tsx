export interface I_TokenList {
  name: string;
  logoURI: string;
  keywords: string[];
  tags: Tags;
  timestamp: Date;
  tokens: Token[];
}

export interface Tags {
  "lp-token": LpToken;
}

export interface LpToken {
  name: string;
  description: string;
}

export interface Token {
  chainId: number;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: null | string;
  tags: string[];
  verified: boolean;
  holders: number | null;
  extensions?: Extensions;
}

export interface Extensions {
  coingeckoId: string;
}
