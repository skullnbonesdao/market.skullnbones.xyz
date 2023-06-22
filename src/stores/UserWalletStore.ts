import { defineStore } from "pinia";

import { Metaplex } from "@metaplex-foundation/js";
import { I_SAG_Player } from "../static/apis/SA_Galaxy/I_SAG_Player";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext,
} from "@solana/web3.js";
import { useGlobalStore } from "./GlobalStore";
import { get_player_profile } from "../static/apis/SA_Galaxy/SA_Galaxy";
import { StatusHelper } from "./StatusHelper";
import {
  getAllFleetsForUserPublicKey,
  getScoreVarsShipInfo,
} from "@staratlas/factory";
import { SCORE_FLEET_PROGRAM_ID } from "../static/constants/StarAtlasConstants";
import {
  ScoreVarsShipInfo,
  ShipStakingInfo,
} from "@staratlas/factory/dist/score";
import { gql } from "graphql-tag";
import { apolloClient } from "../static/graphql/SNBGraphQL";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";
import { TOKEN_PROGRAM_ID } from "solana-spl-current";
import { Client, Token, UtlConfig } from "@solflare-wallet/utl-sdk";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { get_multi_price_birdseye } from "../static/apis/Birdseye/BirdseyeAPI";

export interface I_AccountData {}

export interface I_Score_Data {
  mint: string;
  ship_staking_info: ShipStakingInfo;
  score_vars_ship?: ScoreVarsShipInfo;
  market_price: {
    atlas?: number;
    usdc?: number;
  };
  parsed: {
    food: {
      total: number;
      current: number;
    };

    fuel: {
      total: number;
      current: number;
    };

    ammo: {
      total: number;
      current: number;
    };

    tool: {
      total: number;
      current: number;
    };
  };
}

export interface I_Token {
  publicKey?: PublicKey;
  account?: AccountInfo<ParsedAccountData>;
  metadata: Token | any | StarAtlasAPIItem;
  market_price: {
    atlas?: number;
    usdc?: number;
  };
}

export const useUserWalletStore = defineStore("userWalletStore", {
  state: () => ({
    toggle_items: {
      hide_zero_balances: true,
      only_sa_accounts: true,
      show_accounts: true,
      show_score: true,
      show_history: true,
    },

    status: new StatusHelper(),
    address: {} as PublicKey | undefined,
    sol_balance: 0,
    sa_profile: {} as I_SAG_Player | undefined,
    accounts: [] as I_AccountData | undefined,

    tokens: [] as Array<I_Token>,
    nfts: [] as Array<I_Token>,
    sa_tokens: [] as Array<I_Token>,
    sa_score: [] as Array<I_Score_Data>,
  }),

  actions: {
    async update(address: String) {
      this.sol_balance = 0;
      this.tokens = [];
      this.sa_score = [];
      this.sa_profile = undefined;

      console.log(address);
      this.address = new PublicKey(address);

      this.status.status_set("Loading sol balance", 1, 4);
      await this._load_sol_balance();
      this.status.status_set("Loading sa profile", 2, 4);
      await this._load_sa_profile();
      this.status.status_set("Loading tokens", 4, 4);
      if (this.toggle_items.show_accounts) await this._load_accounts();
      this.status.status_set("Loading score data", 3, 4);
      if (this.toggle_items.show_score) await this._load_score_data();

      this.status.done();
    },
    async _load_sol_balance() {
      const connection = new Connection(useGlobalStore().rpc.url);
      this.sol_balance =
        (await connection.getBalance(
          new PublicKey(this.address?.toString() ?? "")
        )) * Math.pow(10, -9);
    },

    async _load_accounts() {
      this.status.status_set("Loading accounts...", 1, 10);
      this.tokens = [];
      const connection = new Connection(useGlobalStore().rpc.url);

      const user_tokens_all = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(this.address?.toString() ?? ""),
        {
          programId: new PublicKey(TOKEN_PROGRAM_ID),
        }
      );

      console.log("user_tokens_all");
      console.log(user_tokens_all.value);

      this.status.status_inc();
      const config = new UtlConfig({
        /**
         * 101 - mainnet, 102 - testnet, 103 - devnet
         */
        chainId: 101,
        /**
         * number of miliseconds to wait until falling back to CDN
         */
        timeout: 2000,
        /**
         * Solana web3 Connection
         */
        connection: new Connection(useGlobalStore().rpc.url),
        /**
         * Backend API url which is used to query tokens
         */
        apiUrl:
          "https://raw.githubusercontent.com/step-finance/token-list-overrides/main/src/token-list.json",
        /**
         * CDN hosted static token list json which is used in case backend is down
         */
        cdnUrl:
          "https://cdn.jsdelivr.net/gh/solflare-wallet/token-list/solana-tokenlist.json",
      });

      const utl = new Client(config);
      const mints = user_tokens_all.value
        ?.filter((token) => token.account.data.parsed.info.mint)
        ?.flatMap(
          (token) => new PublicKey(token.account.data.parsed.info.mint)
        );
      const token_metadatas = await utl.fetchMints(mints);

      //filter out SA Assets
      this.status.status_inc();
      for (const token1 of user_tokens_all.value.filter((token) =>
        useGlobalStore().sa_api_data.some(
          (sa) => sa.mint === token.account.data.parsed.info.mint
        )
      )) {
        this.sa_tokens.push({
          publicKey: token1.pubkey,
          account: token1.account,
          metadata: useGlobalStore().sa_api_data.find(
            (sa) => sa.mint === token1.account.data.parsed.info.mint
          ),
          market_price: {
            atlas: await fetch_market_price_from_snb(
              token1.account.data.parsed.info.mint.toString(),
              CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? ""
            ),
            usdc: await fetch_market_price_from_snb(
              token1.account.data.parsed.info.mint.toString(),
              CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint ?? ""
            ),
          },
        });
      }

      //filter out Tokens
      this.status.status_inc();
      const filtered_tokens = user_tokens_all.value
        .filter((token) =>
          useGlobalStore().sa_api_data.some(
            (sa) => sa.mint != token.account.data.parsed.info.mint
          )
        )
        .filter(
          (token) => token.account.data.parsed.info.tokenAmount.decimals !== 0
        );
      const birdseye_prices = await get_multi_price_birdseye(
        filtered_tokens.flatMap((t) => t.account.data.parsed.info.mint)
      );
      const atlas_price =
        (await get_multi_price_birdseye([
          CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? "",
        ]).then(
          (data) =>
            data?.data[
              CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? ""
            ]?.value
        )) ?? 0;

      for (const token1 of filtered_tokens) {
        const token_mint =
          token_metadatas.find(
            (meta) => meta.address === token1.account.data.parsed.info.mint
          )?.address ?? "";

        this.tokens.push({
          publicKey: token1.pubkey,
          account: token1.account,
          metadata: token_metadatas.find(
            (meta) => meta.address === token1.account.data.parsed.info.mint
          ),
          market_price: {
            atlas:
              (birdseye_prices?.data[token_mint]?.value ?? 0) / atlas_price ??
              0,
            usdc: birdseye_prices?.data[token_mint]?.value ?? 0,
          },
        });
      }

      //load NFTs
      this.status.status_inc();
      await this._load_nfts(user_tokens_all);

      console.log("++ Done loading tokens ++");
    },

    async _load_nfts(
      user_tokens_all: RpcResponseAndContext<
        { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[]
      >
    ) {
      this.nfts = [];

      const connection = new Connection(useGlobalStore().rpc.url);
      const meta = Metaplex.make(connection);

      console.log("loading nfts");
      let nfts_no_json = await meta
        .nfts()
        .findAllByOwner(new PublicKey(this.address?.toString() ?? ""))
        .run();

      console.log("awaiting metadata promises nfts");
      let nfts_json = await Promise.all(
        nfts_no_json.map((metadata: any) =>
          meta.nfts().loadMetadata(metadata).run()
        )
      );
      console.log("loaded nfts");
      nfts_json.forEach((nft) =>
        this.nfts.push({
          publicKey: user_tokens_all.value.find(
            (token) =>
              token.account.data.parsed.info.mint === nft.mintAddress.toString()
          )?.pubkey,
          account: user_tokens_all.value.find(
            (token) =>
              token.account.data.parsed.info.mint === nft.mintAddress.toString()
          )?.account,
          metadata: nft,
          market_price: {
            atlas: 0,
            usdc: 0,
          },
        })
      );
    },

    async _load_sa_profile() {
      this.sa_profile = await get_player_profile(
        this.address?.toString() ?? ""
      );
    },
    async _load_score_data() {
      this.sa_score = [];

      const ships_in_score = await getAllFleetsForUserPublicKey(
        new Connection(useGlobalStore().rpc.url),
        new PublicKey(this.address ?? ""),
        new PublicKey(SCORE_FLEET_PROGRAM_ID)
      );

      for (const ship of ships_in_score) {
        const score_vars = await getScoreVarsShipInfo(
          new Connection(useGlobalStore().rpc.url),
          new PublicKey(SCORE_FLEET_PROGRAM_ID),
          new PublicKey(ship.shipMint.toString())
        );

        const now = Date.now() / 1000;
        const tripStart = ship.currentCapacityTimestamp.toNumber();
        const timePass = now - tripStart;

        const food_total =
          score_vars.foodMaxReserve * ship.shipQuantityInEscrow.toNumber();
        const food_current =
          food_total -
          ((Date.now() - ship.fedAtTimestamp.toNumber() * 1000) /
            score_vars.millisecondsToBurnOneFood) *
            ship.shipQuantityInEscrow.toNumber();

        const food_parsed = get_food_parsed(ship, score_vars);
        const fuel_parsed = get_fuel_parsed(ship, score_vars);
        const ammo_parsed = get_ammo_parsed(ship, score_vars);
        const tool_parsed = get_tool_parsed(ship, score_vars);

        this.sa_score.push({
          mint: ship.shipMint.toString(),
          ship_staking_info: ship,
          score_vars_ship: score_vars,
          market_price: {
            atlas: await fetch_market_price_from_snb(
              ship.shipMint.toString(),
              CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? ""
            ),
            usdc: await fetch_market_price_from_snb(
              ship.shipMint.toString(),
              CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint ?? ""
            ),
          },
          parsed: {
            food: {
              total: food_parsed.total,
              current: food_parsed.current,
            },
            fuel: {
              total: fuel_parsed.total,
              current: fuel_parsed.current,
            },
            ammo: {
              total: ammo_parsed.total,
              current: ammo_parsed.current,
            },
            tool: {
              total: tool_parsed.total,
              current: tool_parsed.current,
            },
          },
        });
      }
      console.log(this.sa_score);
    },
  },
});

function get_min_time(ship: ShipStakingInfo, score_vars: ScoreVarsShipInfo) {
  let resources_usable = [];
  resources_usable.push(
    score_vars.millisecondsToBurnOneFood * score_vars.foodMaxReserve
  );
  resources_usable.push(
    score_vars.millisecondsToBurnOneFuel * score_vars.fuelMaxReserve
  );
  resources_usable.push(
    score_vars.millisecondsToBurnOneArms * score_vars.armsMaxReserve
  );
  resources_usable.push(
    score_vars.millisecondsToBurnOneToolkit * score_vars.toolkitMaxReserve
  );

  return Math.min(...resources_usable);
}

function get_food_parsed(
  ship: ShipStakingInfo,
  score_vars: ScoreVarsShipInfo
): {
  total: number;
  current: number;
} {
  console.log("mint_time" + get_min_time(ship, score_vars));

  const total =
    score_vars.foodMaxReserve * ship.shipQuantityInEscrow.toNumber();

  let current =
    total -
    ((Date.now() - ship.fedAtTimestamp.toNumber() * 1000) /
      score_vars.millisecondsToBurnOneFood) *
      ship.shipQuantityInEscrow.toNumber();
  if (current < 0) {
    current =
      total -
      (get_min_time(ship, score_vars) /
        score_vars.millisecondsToBurnOneToolkit) *
        ship.shipQuantityInEscrow.toNumber();
  }

  return {
    total,
    current,
  };
}

function get_fuel_parsed(
  ship: ShipStakingInfo,
  score_vars: ScoreVarsShipInfo
): {
  total: number;
  current: number;
} {
  const total =
    score_vars.fuelMaxReserve * ship.shipQuantityInEscrow.toNumber();

  let current =
    total -
    ((Date.now() - ship.fueledAtTimestamp.toNumber() * 1000) /
      score_vars.millisecondsToBurnOneFuel) *
      ship.shipQuantityInEscrow.toNumber();

  if (current < 0) {
    current =
      total -
      (get_min_time(ship, score_vars) / score_vars.millisecondsToBurnOneFuel) *
        ship.shipQuantityInEscrow.toNumber();
  }

  return {
    total,
    current,
  };
}

function get_ammo_parsed(
  ship: ShipStakingInfo,
  score_vars: ScoreVarsShipInfo
): {
  total: number;
  current: number;
} {
  const total =
    score_vars.armsMaxReserve * ship.shipQuantityInEscrow.toNumber();

  let current =
    total -
    ((Date.now() - ship.armedAtTimestamp.toNumber() * 1000) /
      score_vars.millisecondsToBurnOneArms) *
      ship.shipQuantityInEscrow.toNumber();

  if (current < 0) {
    current =
      total -
      (get_min_time(ship, score_vars) / score_vars.millisecondsToBurnOneArms) *
        ship.shipQuantityInEscrow.toNumber();
  }

  return {
    total,
    current,
  };
}

function get_tool_parsed(
  ship: ShipStakingInfo,
  score_vars: ScoreVarsShipInfo
): {
  total: number;
  current: number;
} {
  const total =
    score_vars.toolkitMaxReserve * ship.shipQuantityInEscrow.toNumber();

  let current =
    total -
    ((Date.now() - ship.repairedAtTimestamp.toNumber() * 1000) /
      score_vars.millisecondsToBurnOneToolkit) *
      ship.shipQuantityInEscrow.toNumber();

  if (current < 0) {
    current =
      total -
      (get_min_time(ship, score_vars) /
        score_vars.millisecondsToBurnOneToolkit) *
        ship.shipQuantityInEscrow.toNumber();
  }

  return {
    total,
    current,
  };
}

async function fetch_market_price_from_snb(mint: string, currency: string) {
  if (useGlobalStore().sa_api_data.find((asset) => asset.mint === mint))
    return await apolloClient
      .query({
        query: gql`
          query get_price($mint: String!, $currency: String!) {
            trades(
              where: {
                _and: {
                  asset_mint: { _eq: $mint }
                  currency_mint: { _eq: $currency }
                }
              }
              limit: 1
            ) {
              price
            }
          }
        `,
        variables: {
          mint: mint,
          currency: currency,
        },
      })
      .then((response) => {
        return response.data?.trades[0]?.price;
      })
      .catch((err) => {
        console.error(err);
        return 0;
      });
  return 0;
}

async function fetch_market_price_from_coingecko(mint: string | undefined) {
  let price = 0;

  if (mint)
    await fetch(
      "https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=" +
        mint +
        "&vs_currencies=usd",
      {
        headers: {
          accept: "application/json",
        },
      }
    )
      .then((resp) => {
        return resp.json();
      })
      .then((json) => {
        if (Object.keys(json.data).length) price = json[mint]["usd"];
      });

  return price;
}
