import * as strato from './hedera-strato-hashpack-esm.js';
const { 
  HashPackWallet 
} = strato;

const hpAppMetaData = {
  description: "TwittBar | Hedera Strato HashPack",
  icon: "https://www.hashpack.app/img/logo.svg",
  name: "hTwittBar",
};

async function connectToHashPack(skipNewConnection = false) {
  let wallet = await HashPackWallet.getConnection(false);

  if (!wallet && !skipNewConnection) {
    // No wallet-session could be recovered. Start a fresh one
    wallet = await HashPackWallet.newConnection({
      appMetadata: hpAppMetaData,
      debug: false,
      networkName: 'testnet',
    });
  }

  window.hedera = wallet;
}

// // dApp logic flow
window.connectToHashPack = connectToHashPack;
window.strato = strato;
