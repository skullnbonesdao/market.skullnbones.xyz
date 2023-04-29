export interface I_SagePrize {
  chargeConsumers: string[];
  _id: string;
  sector?: Sector;
  name: string;
  mint?: string;
  quantity: number;
  charges: number;
  spawnTimestamp: number;
  expireTimestamp: number;
  rarity: string;
  discoverTimestamp: number;
  winnerPublicKey: string;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sector {
  x: number;
  y: number;
}
