import { ApiSession, Contract } from "@buidlerlabs/hedera-strato-js";

export default async function ConnectToContract(contractId = process.env.CONTRACT_ID) {
  const { session } = await ApiSession.default();
  const vaultContract = await Contract.newFrom({ path: './TwitterVaultAPI.sol' });
  const liveContract = await session.getLiveContract({ id: contractId, abi: vaultContract.interface });
  return { session, liveContract };
}
