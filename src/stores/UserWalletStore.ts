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

export interface I_TokenData {
  token_account: String;
  token_mint: String;
  account_info: any;
  sa_api_data: StarAtlasAPIItem | undefined;
  token_list_info: tokenlist.Token | undefined;
  account_metadata: Sft | SftWithToken | Nft | NftWithToken | undefined;
  json_metadata: any;
}

export const useUserWalletStore = defineStore("userWalletStore", {
  state: () => ({
    status: {} as StatusHelper,
    address: {} as PublicKey,
    sol_balance: 0,
    sa_profile: {} as I_SAG_Player | undefined,
    tokens: [] as Array<I_TokenData>,
  }),
  actions: {
    init() {
      this.status = new StatusHelper();
    },
    set_address(address: String) {
      this.address = new PublicKey(address);
    },
    async update() {
      this.status.status_set("Loading sol balance", 1, 3);
      await this._load_sol_balance();

      this.status.status_set("Loading sa profile", 2, 3);
      await this._load_sa_profile();

      this.status.status_set("Loading tokens", 3, 3);
      await this._load_tokens();

      this.status.done();
    },

    async _load_sol_balance() {
      const connection = new Connection(useGlobalStore().rpc.url);
      this.sol_balance =
        (await connection.getBalance(new PublicKey(this.address))) *
        Math.pow(10, -9);
    },
    async _load_tokens() {
      this.tokens = [];

      const connection = new Connection(useGlobalStore().rpc.url);
      const meta = Metaplex.make(connection);

      const parsed_token_accounts =
        await connection.getParsedTokenAccountsByOwner(
          new PublicKey(this.address),
          {
            programId: new PublicKey(TOKEN_PROGRAM_ID),
          }
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
      }
    },
    async _load_sa_profile() {
      this.sa_profile = await get_player_profile(this.address.toString());
    },
  },
});
