import { defineStore } from "pinia";
import { Connection } from "@solana/web3.js";

export const useTPS = defineStore("tpsStore", {
  state: () => ({
    poll: {},
    tps: 0.0,
    connection: {} as Connection,
  }),
  actions: {
    pollData(rpc_ul: string) {
      this.poll = setInterval(async () => {
        this.connection = new Connection(rpc_ul);

        const tps_samples = await this.connection.getRecentPerformanceSamples(
          10
        );
        let tps_sum = 0;
        let tps_count = 0;
        tps_samples.forEach((tps: any) => {
          tps_sum += tps.numTransactions / tps.samplePeriodSecs;
          tps_count++;
        });
        this.tps = tps_sum / tps_count;
        console.log("TPS:" + this.tps);
      }, 10000);
    },
  },
});
