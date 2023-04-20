export interface BirdsEyePricesResponse {
  data: { [key: string]: BirdsEyeData };
  success: boolean;
}

export interface BirdsEyeData {
  value: number;
  updateUnixTime: number;
  updateHumanTime: Date;
  priceChange24h: number | null;
}
