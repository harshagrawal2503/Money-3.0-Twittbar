// console.clear();
require("dotenv").config();
const { ApiSession, Contract } = require("@buidlerlabs/hedera-strato-js");
const { Hbar, TransactionId } = require("@hashgraph/sdk");

async function ConnectToContract() {
  const { session } = await ApiSession.default();
  const receiptsSubscription = session.subscribeToReceiptsWith(
    ({ transaction, receipt }) => {
      console.log(`${receipt.status} ${transaction.constructor.name}: ${transaction.transactionId} ${transaction.transactionMemo}`);
    }
  );

  const vaultContract = await Contract.newFrom({ path: './TwitterVaultAPI.sol' });
  const liveContract = await session.upload(vaultContract, { _file: { fileMemo: "Hello Strato" } });
  console.log(`Contract Create ContractId: ${liveContract.id} (Solidity ${liveContract.id.toSolidityAddress()})`);

  return { session, liveContract };
}

async function ConnectToContract(contractId = "0.0.34376129") {
  const { session } = await ApiSession.default();
  const receiptsSubscription = session.subscribeToReceiptsWith(
    ({ transaction, receipt }) => {
      console.log(`${receipt.status} ${transaction.constructor.name}: ${transaction.transactionId} ${transaction.transactionMemo}`);
    }
  );

  const vaultContract = await Contract.newFrom({ path: './TwitterVaultAPI.sol' });
  const liveContract = await session.getLiveContract({ id: contractId, abi: vaultContract.interface });
  return { session, liveContract };
}

async function main() {
  const { liveContract } = await ConnectToContract();
  console.log(Object.keys(liveContract.interface.functions));

  const balance = await liveContract.checkBalance({ onlyReceipt: false });
  console.log('Balance: ', balance);
  const vaultLength = await liveContract.vaultLength("elon");
  console.log('Vault Length: ', `${vaultLength}`);

  // const metaArgs = {
  //   amount: new Hbar(1),
  //   maxTransactionFee: new Hbar(0.1),
  //   transactionId: TransactionId.generate(liveContract.session.wallet.account.id),
  //   transactionMemo: "Custom memo",
  //   transactionValidDuration: 69,
  // };
  // console.log(await liveContract.transferFund(metaArgs, "elon"));
}

main();
