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

export interface I_TokenData {
  token_account: String;
  token_mint: String;
  account_info: any;
  sa_api_data: StarAtlasAPIItem | undefined;
  token_list_info: tokenlist.Token | undefined;
  account_metadata: Sft | SftWithToken | Nft | NftWithToken | undefined;
  json_metadata: any;
}

export interface I_Score_Data {
  mint: string;
  ship_staking_info: ShipStakingInfo;
  score_vars_ship?: ScoreVarsShipInfo;
  parsed: {
    food_percentage: number;
    fuel_percentage: number;
    food_current: number;
    food_total: number;
    food_delta: number;

    currentCapacityTimestamp: number;
    fuel_current: number;
    fuel_total: number;
    ammo_current: number;
    ammo_total: number;
    tool_current: number;
    tool_total: number;
  };
}

export const useUserWalletStore = defineStore("userWalletStore", {
  state: () => ({
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
      await this._load_score_data();
      this.status.status_set("Loading tokens", 4, 4);
      await this._load_tokens();

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

        let metadata = {};

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
          this.tokens.push({
            token_account: token_account.pubkey.toString(),
            token_mint: token_account.account.data.parsed.info.mint.toString(),
            account_info: token_account.account,
            account_metadata: account_metadata,
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

        let remainTime_food = ship.foodCurrentCapacity.toNumber() - timePass;
        const secondsLeft_food = remainTime_food;
        const unitsBurnRate_food =
          1 / (score_vars.millisecondsToBurnOneFood / 1000); // Per Second
        const unitsLeft_food =
          unitsBurnRate_food *
          secondsLeft_food *
          ship.shipQuantityInEscrow.toNumber();
        const unitsLeftPct_food =
          unitsLeft_food /
          (score_vars.foodMaxReserve * ship.shipQuantityInEscrow.toNumber());

        let remainTime_fuel = ship.foodCurrentCapacity.toNumber() - timePass;
        const secondsLeft_fuel = remainTime_fuel;
        const unitsBurnRate_fuel =
          1 / (score_vars.millisecondsToBurnOneFuel / 1000); // Per Second
        const unitsLeft_fuel =
          unitsBurnRate_fuel *
          secondsLeft_fuel *
          ship.shipQuantityInEscrow.toNumber();
        const unitsLeftPct_fuel =
          unitsLeft_fuel /
          (score_vars.fuelMaxReserve * ship.shipQuantityInEscrow.toNumber());

        this.sa_score.push({
          mint: ship.shipMint.toString(),
          ship_staking_info: ship,
          score_vars_ship: score_vars,

          parsed: {
            food_percentage: unitsLeftPct_food,
            fuel_percentage: unitsLeftPct_fuel,

            food_current: ship.foodQuantityInEscrow.toNumber(),
            food_total: ship.foodCurrentCapacity.toNumber(),
            food_delta: ship.fedAtTimestamp.toNumber(),

            currentCapacityTimestamp: ship.currentCapacityTimestamp.toNumber(),
            fuel_current: ship.foodQuantityInEscrow.toNumber() / 86400,
            fuel_total: ship.fuelCurrentCapacity.toNumber() / 86400,
            ammo_current: ship.armsCurrentCapacity.toNumber() / 86400,
            ammo_total: ship.armsCurrentCapacity.toNumber() / 86400,
            tool_current: ship.healthCurrentCapacity.toNumber() / 86400,
            tool_total: ship.armsCurrentCapacity.toNumber() / 86400,
          },
        });
      }
      console.log(this.sa_score);
    },
  },
});

const getPassTimeSinceLastAction = (fleet: ShipStakingInfo): number => {
  let lastRecordTime = fleet.currentCapacityTimestamp.toNumber();
  let currentTime = (Date.now() / 1000) | 0;
  return currentTime - lastRecordTime;
};

const getFoodDemand = (
  scoreInfo: ScoreVarsShipInfo,
  fleet: ShipStakingInfo
): any => {
  let timePass = getPassTimeSinceLastAction(fleet);
  let remainTime = Math.max(0, fleet.foodCurrentCapacity.toNumber() - timePass);
  let shipQuantity = fleet.shipQuantityInEscrow.toNumber();
  let timeOnFullFood =
    (scoreInfo.foodMaxReserve * scoreInfo.millisecondsToBurnOneFood) / 1000;
  let demand =
    ((timeOnFullFood - remainTime) /
      (scoreInfo.millisecondsToBurnOneFood / 1000)) *
    shipQuantity;
  return {
    toBuy: demand,
    timeLeft: remainTime,
  };
};
