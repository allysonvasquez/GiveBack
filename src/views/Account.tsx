// 🌎 Imports in the file
import React from "react";
// UI elements
import {
  Button,
  TextLink,
  Identicon,
  Heading3,
  InfoBlock
} from "@stellar/design-system";
// Modals
import { MakePaymentModal } from "../components/MakePaymentModal";
import { TrustAssetModal } from "../components/TrustAssetModal";
// Methods
import { copyToClipboard } from "../methods/copyToClipboard";
import { fetchAccount } from "../methods/fetchAccount";
import { fundTestnetAccount } from "../methods/fundTestnetAccount";
// Types
import { AccountData } from "../types";

interface AccountProps {
  publicKey: string;
}

export const Account = ({ publicKey }: AccountProps) => {
  // 🌎 Handling React local state (state variable and setter function)
  const [isUiUpdating, setIsUiUpdating] = React.useState(false);
  const [accountData, setAccountData] = React.useState<AccountData | null>(
    null
  );
  const [trustAssetModalVisible, setTrustAssetModalVisible] = React.useState(
    false
  );
  const [makePaymentModalVisible, setMakePaymentModalVisible] = React.useState(
    false
  );

  // 🌎 Fetch account method, using React.useCallback for optimization
  const fetchAccountData = React.useCallback(async () => {
    setIsUiUpdating(true);
    const data = await fetchAccount(publicKey);
    // 🌎 Update local state
    setAccountData(data);
    setIsUiUpdating(false);
  }, [publicKey]);

  // 🌎 Using React `useEffect` hook, fetch account data (initial load or
  // update)
  React.useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  // Action handlers
  const handleCopyAddress = () => {
    // 🌎 Copy public key to clipboard
    copyToClipboard(publicKey);
  };

  const handleFundAccount = async () => {
    setIsUiUpdating(true);
    const fundedResponse = await fundTestnetAccount(publicKey);

    if (fundedResponse) {
      fetchAccountData();
    }

    setIsUiUpdating(false);
  };

  const renderFundAccount = () => (
    <div className="UnfundedAccount">
      <InfoBlock variant={InfoBlock.variant.warning}>
        This account is currently inactive. Click the button below to use
        Friendbot to fund it on test network.
      </InfoBlock>

      <Button onClick={handleFundAccount} isLoading={isUiUpdating}>
        Fund test account
      </Button>
    </div>
  );

  const renderAccountInfo = () => (
    <>
      <Heading3>Balances</Heading3>
      <table className="Balances">
        <tbody>
          {/* 🚀 Render account balances */}
          {accountData?.balances?.map((b) => (
            <tr key={`${b.assetCode}-${b.assetIssuer || "native"}`}>
              <td>{b.assetCode}</td>
              <td>{b.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="Account__buttons">
        <Button onClick={fetchAccountData} isLoading={isUiUpdating}>
          Refresh Account
        </Button>

        <Button
          onClick={() => setTrustAssetModalVisible(true)}
          isLoading={isUiUpdating}
        >
          Trust Asset
        </Button>

        <Button
          onClick={() => setMakePaymentModalVisible(true)}
          isLoading={isUiUpdating}
        >
          Make Payment
        </Button>
      </div>
    </>
  );

  // 🌎 Render Account view UI
  return (
    <div className="Account">
      <Heading3>Your account address</Heading3>
      {/* 🚀 Display identicon which is a unique icon, generated based on the
      wallet public key */}
      <Identicon publicAddress={publicKey} />

      <div className="Account__copyLinks">
        {/* 🌎 Trigger copy public key action */}
        <TextLink onClick={handleCopyAddress}>Copy Address</TextLink>
      </div>

      {accountData?.isUnfunded ? renderFundAccount() : renderAccountInfo()}

      {/* Modals */}
      <TrustAssetModal
        visible={trustAssetModalVisible}
        publicKey={publicKey}
        onClose={() => setTrustAssetModalVisible(false)}
        onDone={fetchAccountData}
      />
      <MakePaymentModal
        visible={makePaymentModalVisible}
        publicKey={publicKey}
        onClose={() => setMakePaymentModalVisible(false)}
        onDone={fetchAccountData}
      />
    </div>
  );
};
