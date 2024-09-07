import ConnectToContract from '../../../helpers/contract';
import HttpErrorHandler, { HttpError } from '../../../helpers/HttpError';
import { accountMapSchema } from '../../../helpers/schema';
import { getSession } from "next-auth/react";
import { AccountId } from '@hashgraph/sdk';

export default async function handler(req, res) {
  HttpErrorHandler(req, res, {
    postFn: async (body) => {
      return mapHederaAccount(body, await getSession({ req }));
    },
  });
}

async function mapHederaAccount(body, session) {
  const handle = session.user.username;
  const account = body.account;
  const validate = accountMapSchema.validate({ handle, account }, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  try {
    const { liveContract } = await ConnectToContract();
    console.log('LiveContract call: updateHandleAddress()');
    const solidityAddress = AccountId.fromString(validate.value.account).toSolidityAddress();

    const metaArgs = {
      transactionMemo: `@${validate.value.handle} map account ${validate.value.account}`,
      transactionValidDuration: 69,
      emitReceipt: true,
    };
    const data = await liveContract.updateHandleAddress(metaArgs, validate.value.handle, solidityAddress);
    console.log(data);
  } catch (error) {
    throw new HttpError(error.message, 400);
  }

  return {
    message: 'Ok',
  };
}
