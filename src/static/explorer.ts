export enum E_EXPLORER {
  SOLSCAN,
  SOLANAFM,
  STARATLAS,
}

export interface I_EXPLORER {
  type: E_EXPLORER;
  name: string;
  url: string;
  image_path: string;
}

export const EXPLORER: Array<I_EXPLORER> = [
  {
    type: E_EXPLORER.SOLSCAN,
    name: "Solscan.io",
    url: "https://solscan.io",
    image_path: "images/explorer/solscan-icon.png",
  },
  {
    type: E_EXPLORER.SOLANAFM,
    name: "Solana.fm",
    url: "https://solana.fm",
    image_path: "images/explorer/solanafm-icon.png",
  },
  {
    type: E_EXPLORER.STARATLAS,
    name: "Play.StarAtlas",
    url: "https://play.staratlas.com",
    image_path: "tokens/ATLAS.webp",
  },
];
