import { PublicKey } from "@solana/web3.js";

export function is_valid_publicKey(public_key: string) {
  try {
    return PublicKey.isOnCurve(new PublicKey(public_key));
  } catch (err) {
    return false;
  }
}
