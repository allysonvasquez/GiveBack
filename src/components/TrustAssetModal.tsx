// 🌎 Imports in the file
import React from "react";
// UI elements
import { Button, Modal, Input, InfoBlock } from "@stellar/design-system";
// Methods
import { buildTrustAsset } from "../methods/buildTrustAsset";
import { signTransaction } from "../methods/signTransaction";
import { submitTransaction } from "../methods/submitTransaction";
// Types
import { GenericError } from "../types";

interface TrustAssetModalProps {
  publicKey: string;
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
}

export const TrustAssetModal = ({
  publicKey,
  visible,
  onClose,
  onDone
}: TrustAssetModalProps) => {
  // 🌎 Handling React local state (state variable and setter function)
  const [assetCode, setAssetCode] = React.useState("");
  const [assetIssuer, setAssetIssuer] = React.useState("");
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const resetLocalState = () => {
    setAssetCode("");
    setAssetIssuer("");
    setIsSubmitInProgress(false);
  };

  // 🌎 Resetting local state when modal opens
  React.useEffect(() => {
    if (visible) {
      resetLocalState();
      setMessage("");
      setError("");
    }
  }, [visible]);

  const handleSubmitTransaction = async () => {
    // 🌎 Making sure error message is cleared
    setError("");

    // 🌎 Very basic input validation
    if (!assetCode || !assetIssuer) {
      // 🌎 Handle error here
      return;
    }

    setIsSubmitInProgress(true);

    try {
      // 🚀 Build trust asset transaction
      const builtTrustAssetTransaction = await buildTrustAsset({
        publicKey,
        assetCode,
        assetIssuer
      });
      // 🚀 Sign trust asset transaction with wallet
      const signedTransaction = await signTransaction(
        builtTrustAssetTransaction
      );
      // 🚀 Submit trust asset transaction
      await submitTransaction(signedTransaction);

      // 🌎 Update state and display done message
      setMessage("Trust asset transaction submitted.");
      resetLocalState();
      onDone();
    } catch (e) {
      // 🌎 Handle error here
      const error = e as GenericError;
      setError(error.toString());
      setIsSubmitInProgress(false);
    }
  };

  // 🌎 Render UI
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Heading>Trust Asset</Modal.Heading>
      <p>Create a trustline to an asset.</p>
      <Modal.Body>
        <Input
          id="assetCode"
          label="Enter asset code"
          value={assetCode}
          onChange={(e) => setAssetCode(e.target.value)}
          disabled={isSubmitInProgress}
        />
        <Input
          id="assetIssuer"
          label="Enter asset issuer"
          value={assetIssuer}
          onChange={(e) => setAssetIssuer(e.target.value)}
          disabled={isSubmitInProgress}
        />

        {isSubmitInProgress ? (
          <div className="GenericMessage">
            <InfoBlock>
              Please follow the instructions in the Albedo popup.
            </InfoBlock>
          </div>
        ) : null}

        {message || error ? (
          <div className="GenericMessage">
            <InfoBlock
              variant={
                error ? InfoBlock.variant.error : InfoBlock.variant.success
              }
            >
              {message || error}
            </InfoBlock>
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={Button.variant.secondary}
          onClick={onClose}
          disabled={isSubmitInProgress}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmitTransaction} disabled={isSubmitInProgress}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
