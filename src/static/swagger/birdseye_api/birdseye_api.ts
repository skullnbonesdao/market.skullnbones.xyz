// Doc can be found here: https://public-api.birdeye.so/#/

import { BirdsEyePrices } from "./birdsyste_pirces_response";

const BASE_URL = "https://public-api.birdeye.so/";

export function get_multi_price(token_addresses: string[]) {
  let addresses_str = "";
  token_addresses.forEach((token) => {
    addresses_str += token + "%";
  });

  let data: BirdsEyePrices | undefined;
  fetch(
    "https://public-api.birdeye.so/public/multi_price?list_address=" +
      addresses_str.slice(0, -1),
    {
      headers: {
        accept: "application/json",
      },
    }
  )
    .then((resp) => resp.json())
    .then((json) => (data = json));

  return data;
}
