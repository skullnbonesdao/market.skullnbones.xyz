const {
  Generator,
  ProviderCoinGecko,
  ProviderLegacyToken,
  ChainId,
  Tag,
} = require("@solflare-wallet/utl-aggregator");
const fs = require("fs");

async function init() {
  // ProviderLegacyToken.clearCache(ChainId.MAINNET)
  // ProviderLegacyToken.clearCache(ChainId.DEVNET)

  const generator = new Generator([
    new ProviderCoinGecko(null, "https://solana-api.projectserum.com/", {
      throttle: 1000,
      throttleCoinGecko: 65 * 1000,
      batchAccountsInfo: 100,
      batchCoinGecko: 25,
    }),
    new ProviderLegacyToken(
      "https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json",
      "https://solana-api.projectserum.com/",
      {
        throttle: 1000,
        batchSignatures: 100,
        batchAccountsInfo: 100,
        batchTokenHolders: 1,
      },
      [Tag.LP_TOKEN],
      ChainId.MAINNET
    ),
  ]);

  const tokenMap = await generator.generateTokenList();

  fs.writeFile(
    "./solana-tokenlist.json",
    JSON.stringify(tokenMap),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    }
  );

  console.log("UTL Completed");
}

init();
