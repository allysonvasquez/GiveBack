// 🌎 Imports in the file
// 🌎 tellar SDK JS library
import StellarSdk from "stellar-sdk";
// 🌎 Constants
import { NETWORK_URL } from "../constants";
// 🌎 Types
import {
  AccountData,
  AccountRecord,
  AccountBalance,
  GenericError
} from "../types";

export const fetchAccount = async (publicKey: string): Promise<AccountData> => {
  // 🚀 Creating server instance with Stellar test network
  const server = new StellarSdk.Server(NETWORK_URL);

  try {
    // 🚀 Fetching account data for the provided public key
    const accountData: AccountRecord = await server
      .accounts()
      .accountId(publicKey)
      .call();

    // 🌎 Destructuring some `accountData` properties for more convenient usage
    const {
      last_modified_time,
      balances,
      num_sponsoring,
      num_sponsored
    } = accountData;

    // 🌎 Returning account data in the format needed for the UI
    return {
      lastModifiedTime: last_modified_time,
      // 🌎 Formatting `balances` to match what is needed in UI
      balances: balances.reduce((res: AccountBalance[], b: any) => {
        let balance;

        // 🚀 If asset type is `native`, we set asset code to XLM
        if (b.asset_type === "native") {
          balance = {
            balance: b.balance,
            assetCode: "XLM"
          };
        } else {
          balance = {
            balance: b.balance,
            assetCode: b.asset_code,
            assetIssuer: b.asset_issuer
          };
        }

        return [...res, balance];
      }, []),
      numSponsoring: num_sponsoring,
      numSponsored: num_sponsored,
      isUnfunded: false
    };
  } catch (error) {
    const err = error as GenericError;

    // 🚀 404 error means that the account is not funded (only public address
    // was created)
    if (err.response && err.response.status === 404) {
      return {
        isUnfunded: true
      };
    }

    throw error;
  }
};
