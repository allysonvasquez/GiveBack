// Last updated: Feb 17, 2022
// Comment convention:
// 🚀 - rocket indicates Stellar code
// 🌎 - globe indicates UI/React related code

// 🌎 Imports in the file
import React from "react";
// UI elements
import { Layout } from "@stellar/design-system";
// Views
import { Account } from "./views/Account";
import { Intro } from "./views/Intro";
// Styles
import "./App.css";

const App = () => {
  // 🌎 Handling React local state (state variables and setter functions)
  const [publicKey, setPublicKey] = React.useState<string | null>(null);

  const conditionalSignOutAction = () => {
    // 🌎 When on the `Account` view, show the `Sign out` link
    if (publicKey) {
      return () => setPublicKey(null);
    }

    // 🌎 Don’t show `Sign out` link on the `Intro` view
    return undefined;
  };

  // 🌎 Only UI related code below. More details will be in each view.
  return (
    <>
      {/* 🌎 Header component */}
      <Layout.Header
        projectTitle="Wallet Example"
        // 🌎 Conditionally render `Sign out` link (if there is no action, the
        // link will not be rendered)
        onSignOut={conditionalSignOutAction()}
        // 🌎 Enable dark mode toggle in the header
        hasDarkModeToggle
      />
      <Layout.Content>
        <Layout.Inset>
          {publicKey ? (
            // 🌎 Render account view, if there is public key
            <Account publicKey={publicKey} />
          ) : (
            // 🌎 Render create intro view, if there is no public key yet
            <Intro setPublicKey={setPublicKey} />
          )}
        </Layout.Inset>
      </Layout.Content>
    </>
  );
};

export default App;
