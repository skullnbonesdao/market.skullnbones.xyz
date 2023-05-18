import * as tokenlistjoson from "./solana-tokenlist.json";
import { I_TokenList } from "./I_TokenList";

export const TOKEN_LIST: I_TokenList = tokenlistjoson as unknown as I_TokenList;
