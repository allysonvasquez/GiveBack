// 🌎 Types
export type AccountBalance = {
  assetCode: string;
  assetIssuer: string | undefined;
  balance: string;
};

export type AccountRecord = {
  last_modified_time: string;
  balances: any[];
  num_sponsoring: number;
  num_sponsored: number;
};

export type AccountData = {
  lastModifiedTime?: string;
  balances?: AccountBalance[];
  numSponsoring?: number;
  numSponsored?: number;
  isUnfunded: boolean;
};

export type MakePaymentResponseParam = {
  destination: string;
  amount: string;
  assetCode: string;
  assetIssuer: string;
};

export type GenericError = {
  [key: string]: any;
};
