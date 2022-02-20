// 🌎 Imports in the file
// Stellar SDK JS library
import StellarSdk, { Transaction } from "stellar-sdk";
// Constants
import { NETWORK_URL, NETWORK_PASSPHRASE } from "../constants";

type TrustAssetProps = {
  publicKey: string;
  assetCode: string;
  assetIssuer: string;
};

export const buildTrustAsset = async ({
  publicKey,
  assetCode,
  assetIssuer
}: TrustAssetProps): Promise<Transaction> => {
  try {
    // 🚀 Creating server instance with Stellar test network
    const server = new StellarSdk.Server(NETWORK_URL);
    // 🚀 Getting account object with populated sequence number
    const account = await server.loadAccount(publicKey);

    // 🚀 Creating transaction with the operation
    return (
      new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE
      })
        .addOperation(
          // 🚀 Using `changeTrust` operation to create trustline
          StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(assetCode, assetIssuer)
          })
        )
        // 🚀 `setTimeout(0)` will set `maxTime` timebounds internally. This is
        // needed if you want to be sure to receive the status of the transaction
        // within a given period.
        .setTimeout(0)
        .build()
    );
  } catch (error) {
    // 🌎 Handle error here
    throw new Error("Building add trustline transaction failed");
  }
};
