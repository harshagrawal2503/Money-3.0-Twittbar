import { Hbar, HbarUnit } from "@hashgraph/sdk";
import ConnectToContract from '../../../helpers/contract';
import HttpErrorHandler from '../../../helpers/HttpError';

export default async function handler(req, res) { 
  HttpErrorHandler(req, res, {
    getFn: getBalance,
  });
}

async function getBalance() {
  const { liveContract } = await ConnectToContract();
  console.log('LiveContract call: checkBalance()');
  const data = await liveContract.checkBalance({ onlyReceipt: false });
  return {
    contract: Hbar.fromTinybars(data.contractAccount).to(HbarUnit.Hbar),
    owner: Hbar.fromTinybars(data.ownerAccount).to(HbarUnit.Hbar),
  };
}
