// 🌎 Imports in the file
// Stellar SDK JS library
import StellarSdk, { Transaction } from "stellar-sdk";
// Constants
import { NETWORK_URL } from "../constants";

export const submitTransaction = async (signedTransaction: Transaction) => {
  // 🚀 Creating server instance with Stellar test network
  const server = new StellarSdk.Server(NETWORK_URL);

  try {
    // 🚀 Submitting signed transaction to the network
    return await server.submitTransaction(signedTransaction);
  } catch (e) {
    // 🌎 Handle error here
    throw new Error("Failed to submit payment transaction");
  }
};
