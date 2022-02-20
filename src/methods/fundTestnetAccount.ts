export const fundTestnetAccount = async (publicKey: string) => {
  try {
    // 🚀 Funding account with Friendbot on test network
    await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    return true;
  } catch (e) {
    // 🌎 Handle error here
    return false;
  }
};
