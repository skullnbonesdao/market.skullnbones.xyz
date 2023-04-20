export interface BirdsEyePrices {
  data: { [key: string]: Data };
  success: boolean;
}

export interface Data {
  value: number;
  updateUnixTime: number;
  updateHumanTime: Date;
  priceChange24h: number | null;
}
