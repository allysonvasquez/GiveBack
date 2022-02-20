// 🌎 Imports in the file
// Stellar SDK JS library
import StellarSdk from "stellar-sdk";
// Constants
import { NETWORK_PASSPHRASE, NETWORK_URL } from "../constants";

type BuildPaymentProps = {
  amount: string;
  assetCode: string;
  assetIssuer: string;
  destination: string;
  publicKey: string;
};

export const buildPayment = async ({
  amount,
  assetCode,
  assetIssuer,
  destination,
  publicKey
}: BuildPaymentProps) => {
  try {
    // 🚀 Creating server instance with Stellar test network
    const server = new StellarSdk.Server(NETWORK_URL);
    // 🚀 Getting sequence number from the account
    const { sequence } = await server.loadAccount(publicKey);
    // 🚀 Creating source account instance
    const source = await new StellarSdk.Account(publicKey, sequence);

    // 🚀 For brevity, we are not checking if the destination account is funded
    // or if it has a trustline to the asset (if it is not native XLM).
    // To fund/create a destination account, at least 1 XLM needs to be sent
    // using create account operation.

    // 🚀 Creating asset instance (native or issued)
    const asset =
      !assetCode || assetCode === "XLM"
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(assetCode, assetIssuer);

    // 🚀 Creating payment operation
    const operation = StellarSdk.Operation.payment({
      destination,
      asset,
      amount: amount.toString()
    });

    // 🚀 Creating transaction with the operation
    const transaction = new StellarSdk.TransactionBuilder(source, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
      // 🚀 Setting timebounds to allow enough time to submit the transaction
      timebounds: await server.fetchTimebounds(100)
    }).addOperation(operation);

    // 🚀 Normally we would need to call setTimeout() here, but setting
    // timebounds earlier takes care of it

    // 🚀 Building transaction
    return transaction.build();
  } catch (error) {
    // 🌎 Handle transaction error here
    throw new Error("Building payment transaction failed");
  }
};
