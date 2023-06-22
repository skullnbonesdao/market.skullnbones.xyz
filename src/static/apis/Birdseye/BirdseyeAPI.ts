import { I_MultiTokenPrice } from "./I_MultiTokenPrice";

export async function get_multi_price_birdseye(mints: string[] | undefined) {
  let data: I_MultiTokenPrice | undefined;

  let url = "https://public-api.birdeye.so/public/multi_price?list_address=";

  mints?.forEach((m, idx) => {
    if (idx === 0) {
      url += m;
    } else {
      url += "%2C" + m;
    }
  });

  await fetch(url)
    .then((resp) => resp.json())
    .then((json) => (data = json))
    .catch((err) => console.error(err));

  return data;
}
