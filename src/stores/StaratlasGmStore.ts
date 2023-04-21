import { defineStore } from "pinia";
import {
  GmClientService,
  GmOrderbookService,
  Order,
  OrderSide,
} from "@staratlas/factory";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";

export interface OrderBookOrderMap {
  size: number;
  price: number;
  owners: string[];
}

import { useGlobalStore } from "./GlobalStore";
import { GM_PROGRAM_ID } from "../static/constants/StarAtlasConstants";
import { CURRENCIES, E_CURRENCIES } from "../static/currencies";

type getInitializeOrderTransactionResponse = {
  transaction: Transaction;
  signers: Keypair[];
};

export const useStaratlasGmStore = defineStore({
  id: "staratlasGmStore",

  state: () => ({
    client: new GmClientService(),
    connection: new Connection(useGlobalStore().rpc.url),
    order_book_service: new GmOrderbookService(
      new Connection(useGlobalStore().rpc.url),
      new PublicKey(GM_PROGRAM_ID)
    ),
    orders: [] as Order[],
    playerOrders: [] as Order[],
    atlasOrders: {
      buyOrders: [] as OrderBookOrderMap[],
      sellOrders: [] as OrderBookOrderMap[],
    },
    usdcOrders: {
      buyOrders: [] as OrderBookOrderMap[],
      sellOrders: [] as OrderBookOrderMap[],
    },
  }),

  actions: {
    getSumOrders(side: string, pair: PublicKey) {
      const filtered = this.orders
        .filter(
          (order) =>
            order.orderType === side && order.currencyMint === pair.toString()
        )
        .flatMap((order) => order.orderOriginationQty);
      return Math.max.apply(Math, filtered);
    },

    async getOpenOrdersForAsset(assetMint: string) {
      await this.client
        .getOpenOrdersForAsset(
          new Connection(useGlobalStore().rpc.url),
          new PublicKey(assetMint),
          new PublicKey(GM_PROGRAM_ID)
        )
        .then((response: any) => {
          this.orders = response;
          this.atlasOrders.sellOrders = [];
          this.atlasOrders.buyOrders = [];
          this.usdcOrders.sellOrders = [];
          this.usdcOrders.buyOrders = [];
          this.orders
            .filter(
              (order) =>
                order.orderType === "buy" &&
                order.currencyMint ===
                  CURRENCIES.find(
                    (c) => c.type === E_CURRENCIES.ATLAS
                  )?.mint.toString()
            )
            ?.sort(sort_prices)
            .forEach((order) => {
              if (
                this.atlasOrders.buyOrders.some(
                  (stored) => stored.price === order.uiPrice
                )
              ) {
                this.atlasOrders.buyOrders
                  .find((stored) => stored.price === order.uiPrice)
                  ?.owners.push(order.owner);
                this.atlasOrders.buyOrders.find(
                  (stored) => stored.price === order.uiPrice
                )!.size += order.orderQtyRemaining;
              } else
                this.atlasOrders.buyOrders.push({
                  owners: [order.owner],
                  price: order.uiPrice,
                  size: order.orderQtyRemaining,
                });
            });

          this.orders
            .filter(
              (order) =>
                order.orderType === "sell" &&
                order.currencyMint ===
                  CURRENCIES.find(
                    (c) => c.type === E_CURRENCIES.ATLAS
                  )?.mint.toString()
            )
            ?.sort(sort_prices)
            .forEach((order) => {
              if (
                this.atlasOrders.sellOrders.some(
                  (stored) => stored.price === order.uiPrice
                )
              ) {
                this.atlasOrders.sellOrders
                  .find((stored) => stored.price === order.uiPrice)
                  ?.owners.push(order.owner);
                this.atlasOrders.sellOrders.find(
                  (stored) => stored.price === order.uiPrice
                )!.size += order.orderQtyRemaining;
              } else
                this.atlasOrders.sellOrders.push({
                  owners: [order.owner],
                  price: order.uiPrice,
                  size: order.orderQtyRemaining,
                });
            });

          this.orders
            .filter(
              (order) =>
                order.orderType === "buy" &&
                order.currencyMint ===
                  CURRENCIES.find(
                    (c) => c.type === E_CURRENCIES.USDC
                  )?.mint.toString()
            )
            ?.sort(sort_prices)
            .forEach((order) => {
              if (
                this.usdcOrders.buyOrders.some(
                  (stored) => stored.price === order.uiPrice
                )
              ) {
                this.usdcOrders.buyOrders
                  .find((stored) => stored.price === order.uiPrice)
                  ?.owners.push(order.owner);
                this.usdcOrders.buyOrders.find(
                  (stored) => stored.price === order.uiPrice
                )!.size += order.orderQtyRemaining;
              } else
                this.usdcOrders.buyOrders.push({
                  owners: [order.owner],
                  price: order.uiPrice,
                  size: order.orderQtyRemaining,
                });
            });

          this.orders
            .filter(
              (order) =>
                order.orderType === "sell" &&
                order.currencyMint ===
                  CURRENCIES.find(
                    (c) => c.type === E_CURRENCIES.USDC
                  )?.mint.toString()
            )
            ?.sort(sort_prices)
            .forEach((order) => {
              if (
                this.usdcOrders.sellOrders.some(
                  (stored) => stored.price === order.uiPrice
                )
              ) {
                this.usdcOrders.sellOrders
                  .find((stored) => stored.price === order.uiPrice)
                  ?.owners.push(order.owner);
                this.usdcOrders.sellOrders.find(
                  (stored) => stored.price === order.uiPrice
                )!.size += order.orderQtyRemaining;
              } else
                this.usdcOrders.sellOrders.push({
                  owners: [order.owner],
                  price: order.uiPrice,
                  size: order.orderQtyRemaining,
                });
            });
        })
        .catch((err: any) =>
          console.log("{getOpenOrdersForAssetError}: " + err)
        );
    },
    async getInitializeOrderTransaction(
      playerPublicKey: PublicKey,
      assetMint: string,
      quoteMint: string,
      quantity: number,
      price: number,
      orderSide: OrderSide
    ) {
      const bnPrice = await this.client.getBnPriceForCurrency(
        new Connection(useGlobalStore().rpc.url),
        price,
        new PublicKey(quoteMint),
        new PublicKey(GM_PROGRAM_ID)
      );
      return await this.client
        .getInitializeOrderTransaction(
          new Connection(useGlobalStore().rpc.url),
          playerPublicKey,
          new PublicKey(assetMint),
          new PublicKey(quoteMint),
          quantity,
          bnPrice,
          new PublicKey(GM_PROGRAM_ID),
          orderSide
        )
        .then((response: getInitializeOrderTransactionResponse) => {
          console.log("getInitializeOrderTransaction", response);
          return response;
        });
    },
    async getOpenOrdersForPlayer(player_PK: PublicKey | null) {
      if (!player_PK) return;
      return await this.client.getOpenOrdersForPlayer(
        new Connection(useGlobalStore().rpc.url),
        player_PK,
        new PublicKey(GM_PROGRAM_ID)
      );
    },
    async getCloseOrderForPlayer(
      player_PK: PublicKey | null,
      account_to_close: PublicKey
    ) {
      if (!player_PK) return;
      return await this.client.getCancelOrderTransaction(
        new Connection(useGlobalStore().rpc.url),
        account_to_close,
        player_PK,
        new PublicKey(GM_PROGRAM_ID)
      );
    },
  },
});

function sort_prices(a: any, b: any): number {
  return a.uiPrice > b.uiPrice ? -1 : 1;
}
