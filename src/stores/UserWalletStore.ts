import { defineStore } from "pinia";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import * as tokenlist from "../static/apis/TokenList/I_TokenList";
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js";
import { I_SAG_Player } from "../static/apis/SA_Galaxy/I_SAG_Player";
import { Connection, PublicKey } from "@solana/web3.js";
import { useGlobalStore } from "./GlobalStore";
import { TOKEN_LIST } from "../static/apis/TokenList/TokenList";
import { TOKEN_PROGRAM_ID } from "solana-spl-current";
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

export interface I_TokenData {
  token_account: String;
  token_mint: String;
  account_info: any;
  market_price: {
    atlas?: number;
    usdc?: number;
  };
  sa_api_data: StarAtlasAPIItem | undefined;
  token_list_info: tokenlist.Token | undefined;
  account_metadata: Sft | SftWithToken | Nft | NftWithToken | undefined;
  json_metadata: any;
}

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
    tokens: [] as Array<I_TokenData>,
    sa_score: [] as Array<I_Score_Data>,
  }),

  actions: {
    async update(address: String) {
      console.log(address);
      this.address = new PublicKey(address);

      this.status.status_set("Loading sol balance", 1, 4);
      await this._load_sol_balance();
      this.status.status_set("Loading sa profile", 2, 4);
      await this._load_sa_profile();
      this.status.status_set("Loading score data", 3, 4);
      if (this.toggle_items.show_score) await this._load_score_data();
      this.status.status_set("Loading tokens", 4, 4);
      if (this.toggle_items.show_accounts) await this._load_tokens();

      this.status.done();
    },
    async _load_sol_balance() {
      const connection = new Connection(useGlobalStore().rpc.url);
      this.sol_balance =
        (await connection.getBalance(
          new PublicKey(this.address?.toString() ?? "")
        )) * Math.pow(10, -9);
    },
    async _load_tokens() {
      this.tokens = [];

      const connection = new Connection(useGlobalStore().rpc.url);
      const meta = Metaplex.make(connection);

      const parsed_token_accounts =
        await connection.getParsedTokenAccountsByOwner(
          new PublicKey(this.address?.toString() ?? ""),
          {
            programId: new PublicKey(TOKEN_PROGRAM_ID),
          }
        );

      this.status.status_set(
        "Loading token list",
        0,
        parsed_token_accounts.value.length
      );
      for (const token_account of parsed_token_accounts.value) {
        let account_metadata: any = {};

        await meta
          .nfts()
          .findByMint({
            mintAddress: new PublicKey(
              token_account.account.data.parsed?.info.mint
            ),
          })
          .then((data) => {
            account_metadata = data;
          })
          .catch((err) => {
            console.log("Error fetching metaplex-data:" + err);
          });

        console.log(account_metadata);

        let metadata = {};

        //IF SA asset
        if (account_metadata && account_metadata.uri) {
          await fetch(account_metadata.uri)
            .then((resp) => resp.json())
            .then((json) => (metadata = json))
            .catch((err) => console.log("Error fetching metadata-link" + err));

          this.tokens.push({
            token_account: token_account.pubkey.toString(),
            token_mint: token_account.account.data.parsed.info.mint.toString(),
            account_info: token_account.account,
            account_metadata: account_metadata,
            market_price: {
              atlas: await fetch_market_price_from_snb(
                token_account.account.data.parsed.info.mint.toString(),
                CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ??
                  ""
              ),
              usdc:
                (await fetch_market_price_from_snb(
                  token_account.account.data.parsed.info.mint.toString(),
                  CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint ??
                    ""
                )) === 0
                  ? await fetch_token_price_birdseye(
                      token_account.account.data.parsed.info.mint.toString()
                    )
                  : 0,
            },
            token_list_info: TOKEN_LIST.tokens.find(
              (t) => t.address === token_account.account.data.parsed?.info.mint
            ),
            sa_api_data: useGlobalStore().sa_api_data.find(
              (api) =>
                api.mint ===
                token_account.account.data.parsed.info.mint.toString()
            ),
            json_metadata: metadata,
          });
        } else {
          let usdc_price =
            token_account.account.data.parsed.info.mint.toString() !=
            (CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC)?.mint ?? "")
              ? await fetch_token_price_birdseye(
                  token_account.account.data.parsed.info.mint.toString()
                )
              : 1;

          let atlas_price =
            token_account.account.data.parsed.info.mint.toString() !=
            (CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ?? "")
              ? usdc_price /
                (await fetch_token_price_birdseye(
                  CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS)?.mint ??
                    ""
                ))
              : 1;

          this.tokens.push({
            token_account: token_account.pubkey.toString(),
            token_mint: token_account.account.data.parsed.info.mint.toString(),
            account_info: token_account.account,
            account_metadata: account_metadata,
            market_price: {
              atlas: atlas_price,
              usdc: usdc_price,
            },
            token_list_info: TOKEN_LIST.tokens.find(
              (t) => t.address === token_account.account.data?.parsed?.info.mint
            ),
            sa_api_data: useGlobalStore().sa_api_data.find(
              (api) =>
                api.mint ===
                token_account.account.data.parsed.info.mint.toString()
            ),
            json_metadata: metadata,
          });
        }
        this.status.status_inc();
      }
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
        return response.data.trades[0].price;
      })
      .catch((err) => {
        console.error(err);
        return 0;
      });
  return 0;
}

async function fetch_token_price_birdseye(mint: string) {
  console.log("price");
  let price = 0;
  await fetch("https://public-api.birdeye.so/public/price?address=" + mint)
    .then((resp) => resp.json())
    .then((json) => (price = json.data.value))
    .catch((err) => console.error(err));
  return price;
}
