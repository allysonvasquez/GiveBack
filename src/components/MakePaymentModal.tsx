// 🌎 Imports in the file
import React from "react";
// UI elements
import { Button, Modal, Input, InfoBlock } from "@stellar/design-system";
// Methods
import { buildPayment } from "../methods/buildPayment";
import { signTransaction } from "../methods/signTransaction";
import { submitTransaction } from "../methods/submitTransaction";
// Types
import { GenericError } from "../types";

interface MakePaymentModalProps {
  publicKey: string;
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
}

export const MakePaymentModal = ({
  publicKey,
  visible,
  onClose,
  onDone
}: MakePaymentModalProps) => {
  // 🌎 Handling React local state (state variable and setter function)
  const [destination, setDestination] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [assetCode, setAssetCode] = React.useState("");
  const [assetIssuer, setAssetIssuer] = React.useState("");
  const [isNativeAsset, setIsNativeAsset] = React.useState(false);
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const resetLocalState = () => {
    setDestination("");
    setAmount("");
    setAssetCode("");
    setAssetIssuer("");
    setIsNativeAsset(false);
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
    if (!destination || !amount || !assetCode) {
      // 🌎 Handle error here
      return;
    }

    if (!isNativeAsset && !assetIssuer) {
      // 🌎 Handle error here
      return;
    }

    setIsSubmitInProgress(true);

    try {
      // 🚀 Build payment transaction
      const builtPaymentTransaction = await buildPayment({
        amount,
        destination,
        assetCode,
        assetIssuer,
        publicKey
      });
      // 🚀 Sign payment transaction with wallet
      const signedTransaction = await signTransaction(builtPaymentTransaction);
      // 🚀 Submit payment transaction
      await submitTransaction(signedTransaction);

      // 🌎 Update state and display done message
      setMessage("Payment transaction submitted.");
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
      <Modal.Heading>Make Payment</Modal.Heading>
      <Modal.Body>
        <Input
          id="destination"
          label="Enter destination address"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          disabled={isSubmitInProgress}
        />
        <Input
          id="amount"
          label="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          disabled={isSubmitInProgress}
        />
        <Input
          id="assetCode"
          label="Enter asset code"
          value={assetCode}
          onChange={(e) => {
            setAssetCode(e.target.value);
            setIsNativeAsset(e.target.value === "XLM");
          }}
          disabled={isSubmitInProgress}
        />
        <Input
          id="assetIssuer"
          label="Enter asset issuer"
          value={assetIssuer}
          onChange={(e) => setAssetIssuer(e.target.value)}
          // 🌎 Disabling asset issuer input field for native XLM asset, which
          // does not have asset issuer
          disabled={isSubmitInProgress || isNativeAsset}
          note={isNativeAsset ? "XLM is native asset" : null}
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
          Submit transaction
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
