import { I_SAG_Player } from "./I_SAG_Player";
import { I_SagePrize } from "./I_Sage_Prizes";

export async function get_player_profile(
  address: string
): Promise<I_SAG_Player | undefined> {
  let data;
  try {
    await fetch("https://galaxy.staratlas.com/players/" + address)
      .then((resp) => resp?.json())
      .then((json) => (data = json as I_SAG_Player));
    if (data) {
      return data;
    } else return undefined;
  } catch (err) {
    console.error("Error loading SA-Player profile - maybe there is none?");
    return undefined;
  }
}

export async function get_player_prizes(
  address: string
): Promise<I_SagePrize[] | undefined> {
  let data;
  await fetch("https://galaxy.staratlas.com/prizes/" + address)
    .then((resp) => resp.json())
    .then((json) => (data = json as I_SagePrize[]));
  if (data) {
    return data;
  } else return undefined;
}
