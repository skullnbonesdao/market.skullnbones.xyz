import { defineStore } from "pinia";
import {
  getAllFleetsForUserPublicKey,
  getScoreVarsShipInfo,
  GmClientService,
  GmOrderbookService,
  Order,
  OrderSide,
  ScoreVarsShipInfo,
} from "@staratlas/factory";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { _update_status, Status, useGlobalStore } from "./GlobalStore";
import {
  GM_PROGRAM_ID,
  SCORE_FLEET_PROGRAM_ID,
} from "../static/constants/StarAtlasConstants";
import { CURRENCIES, E_CURRENCIES, I_CURRENCY } from "../static/currencies";
import { ShipStakingInfo } from "@staratlas/factory/dist/score";
import { StarAtlasAPIItem } from "../static/StarAtlasAPIItem";
import { useUserWalletStore } from "./UserWalletStore";

export interface OrderBookOrderMap {
  size: number;
  price: number;
  owners: [string];
}

type getInitializeOrderTransactionResponse = {
  transaction: Transaction;
  signers: Keypair[];
};

interface ScoreParsedShipInfo {
  food_remaining_time: number;
  fuel_remaining_time: number;
  arms_remaining_time: number;
  tools_remaining_time: number;
}

interface ScoreTableData {
  shipStatkingInfo: ShipStakingInfo;
  scoreVarsShipInfo: ScoreVarsShipInfo;
  parsed: ScoreParsedShipInfo;
}

interface MarketValues {
  itemType: E_CURRENCIES;
  sell_min: number;
  sell_max: number;
  buy_min: number;
  buy_max: number;
}

interface MarketTablData {
  api_data: StarAtlasAPIItem;
  orders_atlas: MarketValues;
  orders_usdc: MarketValues;
}

export const useStaratlasGmStore = defineStore({
  id: "staratlasGmStore",

  state: () => ({
    status: {} as Status,
    score_table_data: [] as ScoreTableData[],
    market_table_data: [] as MarketTablData[],
    order_book_service: new GmOrderbookService(
      useGlobalStore().connection as Connection,
      new PublicKey(GM_PROGRAM_ID)
    ),
    gmClientService: new GmClientService(),

    //old
    client: new GmClientService(),
    connection: new Connection(useGlobalStore().rpc.url),

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
    async init() {
      this.status = {
        is_initialized: false,
        is_loading: true,
        message: "GM init",
        step: 0,
        step_total: 1,
      };

      this.status = _update_status(this.status, false, "GM init done", 1, 1);
      this.status.is_initialized = true;
      await useStaratlasGmStore().order_book_service.loadInitialOrders();

      setInterval(async function () {
        console.log("update orderbooks");
        //        await useStaratlasGmStore().order_book_service.initialize();
        await useStaratlasGmStore().order_book_service.loadInitialOrders();
      }, 10000);
    },

    getSumOrders(side: string, pair: PublicKey) {
      const filtered = this.orders
        .filter(
          (order) =>
            order.orderType === side && order.currencyMint === pair.toString()
        )
        .flatMap((order) => order.orderOriginationQty);
      return Math.max.apply(Math, filtered);
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

    async update_filtered_market_table_data(item_type: string) {
      this.status = _update_status(
        this.status,
        true,
        "Updating filters on table",
        0,
        3
      );

      if (!item_type) return;
      this.market_table_data = [];

      // const allOrders = await this.gmClientService.getAllOpenOrders(
      //   new Connection(useGlobalStore().rpc.url),
      //   new PublicKey(GM_PROGRAM_ID)
      // );

      // console.log(allOrders);

      for (const filtered of useGlobalStore().sa_api_data.filter(
        (api) =>
          api.attributes.itemType.toLowerCase() === item_type.toLowerCase()
      )) {
        let orders = Array.from(
          await useStaratlasGmStore()
            .order_book_service.getAllOrdersByItemMint(filtered.mint)
            .values()
        );
        // let orders = allOrders.filter(
        //   (order) => order.currencyMint.toString() === filtered.mint
        // );

        this.status = _update_status(this.status, true, "Map USDC", 1, 3);

        let orders_usdc: MarketValues = {
          itemType: E_CURRENCIES.USDC,
          buy_max: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Buy,
            1
          ),
          buy_min: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Buy,
            -1
          ),
          sell_max: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Sell,
            1
          ),
          sell_min: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.USDC) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Sell,
            -1
          ),
        };

        this.status = _update_status(this.status, true, "Map ATLAS", 2, 3);

        let orders_atlas: MarketValues = {
          itemType: E_CURRENCIES.ATLAS,
          buy_max: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Buy,
            1
          ),
          buy_min: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Buy,
            -1
          ),
          sell_max: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Sell,
            1
          ),
          sell_min: _get_order(
            orders,
            CURRENCIES.find((c) => c.type === E_CURRENCIES.ATLAS) ??
              CURRENCIES[0],
            filtered.mint.toString(),
            OrderSide.Sell,
            -1
          ),
        };

        this.status = _update_status(this.status, true, "Push data", 3, 3);

        this.market_table_data.push({
          api_data: filtered,
          orders_usdc: orders_usdc,
          orders_atlas: orders_atlas,
        });
      }

      this.status = _update_status(
        this.status,
        false,
        "Updated market table data"
      );
    },

    async _fetch_and_map_score_data() {
      this.status = _update_status(this.status, true, "Get User Fleet", 1, 3);
      const ship_staking_infos = await getAllFleetsForUserPublicKey(
        new Connection(useGlobalStore().rpc.url),
        new PublicKey(useUserWalletStore().address ?? ""),
        new PublicKey(SCORE_FLEET_PROGRAM_ID)
      );

      this.status = _update_status(this.status, true, "Map User Fleet", 2, 3);

      this.score_table_data = [];
      for (const ship of ship_staking_infos) {
        this.score_table_data.push({
          shipStatkingInfo: ship,
          scoreVarsShipInfo: await getScoreVarsShipInfo(
            new Connection(useGlobalStore().rpc.url),
            new PublicKey(SCORE_FLEET_PROGRAM_ID),
            new PublicKey(ship.shipMint.toString())
          ),
          parsed: {
            food_remaining_time:
              ship.foodCurrentCapacity.toNumber() - get_time_last_action(ship),
            arms_remaining_time:
              ship.armsCurrentCapacity.toNumber() - get_time_last_action(ship),
            fuel_remaining_time:
              ship.fuelCurrentCapacity.toNumber() - get_time_last_action(ship),
            tools_remaining_time:
              ship.healthCurrentCapacity.toNumber() -
              get_time_last_action(ship),
          },
        });
      }
    },
  },
});

function get_time_last_action(ship_staking_info: ShipStakingInfo): number {
  let capacity_max = ship_staking_info.currentCapacityTimestamp.toNumber();
  return Date.now() / 1000 - capacity_max;
}

function _get_order(
  orders: Order[],
  currency: I_CURRENCY,
  mint: string,
  side: OrderSide,
  direction: number
): number {
  let orders_filtered = orders
    ?.filter((o) => o.orderMint.toString() === mint)
    ?.filter((o) => o.currencyMint?.toString() === currency.mint)
    ?.filter((o) => o.orderType === side);

  let order;

  if (orders_filtered.length) {
    if (direction === -1) {
      order = orders_filtered?.reduce((a, b) =>
        a.uiPrice < b.uiPrice ? a : b
      )?.uiPrice;
    } else {
      order = orders_filtered?.reduce((a, b) =>
        a?.uiPrice > b.uiPrice ? a : b
      )?.uiPrice;
    }
  }

  if (order) {
    return order;
  } else return 0.0;
}
