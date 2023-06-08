export interface I_MultiTokenPrice {
  data: { [key: string]: Price };
  success: boolean;
}

export interface Price {
  value: number;
  updateUnixTime: number;
  updateHumanTime: Date;
  priceChange24h: number;
}
