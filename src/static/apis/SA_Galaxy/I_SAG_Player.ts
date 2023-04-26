export interface I_SAG_Player {
  updatedAt: Date;
  avatarId: null;
  badgeMint: null;
  _id: string;
  publicKey: string;
  balance: number;
  balances: I_Balance[];
  currencySymbol: string;
  faction: number;
  factionRank: number;
  rank: number;
  country: null;
  registrationDate: Date;
}

export interface I_Balance {
  _id: string;
  mint: string;
  quantity: number;
  valuePerAsset: number;
}
