// ð Imports in the file
// Stellar SDK JS library
import StellarSdk, { Transaction } from "stellar-sdk";
// Albedo wallet
import albedo from "@albedo-link/intent";
// Types
import { GenericError } from "../types";

export const signTransaction = async (
  transaction: Transaction
): Promise<Transaction> => {
  try {
    // ð Converting the transaction to XDR format (Albedo SDK requirement)
    const transactionXdr = transaction.toXDR();

    // ð Sign transaction with Albedo wallet on test network (this will trigger
    // Albedo popup)
    const response = await albedo.tx({
      xdr: transactionXdr,
      network: "testnet"
    });

    // ð Return an error if the response is not correct
    if (!response.signed_envelope_xdr) {
      throw new Error("Couldnât sign the transaction with Albedo.");
    }

    // ð Returning signed transaction (converted from XDR back to Transaction)
    return StellarSdk.TransactionBuilder.fromXDR(
      response.signed_envelope_xdr,
      StellarSdk.Networks.TESTNET
    );
  } catch (e) {
    // ð Handle error here
    const error = e as GenericError;
    throw error.message;
  }
};
