// 🌎 Imports in the file
// UI elements
import { Heading2, Button, InfoBlock } from "@stellar/design-system";
// Albedo
import albedo from "@albedo-link/intent";

interface IntroProps {
  setPublicKey: (publicKey: string) => void;
}

export const Intro = ({ setPublicKey }: IntroProps) => {
  const albedoGetPublicKey = async () => {
    try {
      // 🚀 Request public key from Albedo wallet
      const albedoResponse = await albedo.publicKey({});
      setPublicKey(albedoResponse.pubkey);
    } catch (e) {
      // 🌎 Handle error here
    }
  };

  // 🌎 Render Intro view UI
  return (
    <div>
      <Heading2>Basic Wallet Example</Heading2>

      <InfoBlock>
        Click on "Connect with Albedo" to launch Albedo browser wallet.
      </InfoBlock>

      <div className="Intro__buttons">
        <Button onClick={albedoGetPublicKey}>Connect with Albedo</Button>
      </div>
    </div>
  );
};
