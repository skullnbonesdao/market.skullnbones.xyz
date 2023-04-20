// Doc can be found here: https://public-api.birdeye.so/#/

import {
  BirdsEyeData,
  BirdsEyePricesResponse,
} from "./birdsyste_pirces_response";

const BASE_URL = "https://public-api.birdeye.so/";

export async function get_multi_price(token_addresses: Array<string>) {
  let addresses_str = "";
  token_addresses.forEach((token) => {
    addresses_str += token + "%2C";
  });

  let data: BirdsEyePricesResponse | undefined;
  await fetch(
    "https://public-api.birdeye.so/public/multi_price?list_address=" +
      addresses_str.slice(0, -3),
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
