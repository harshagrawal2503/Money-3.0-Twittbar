//
// reference: https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
//
function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function isHashpackConnected() {
  const HASHPACK_STORAGE_KEY = "hashpack-session";

  if (!window.hedera)
    return false;
  
  if (window.hedera && window.hedera.constructor.name !== 'HashPackWallet')
    return false;
  
  const localWalletData = localStorage.getItem(HASHPACK_STORAGE_KEY);
  if (localWalletData == null)
    return false;

  return true;
}

export { timeSince, isHashpackConnected }
