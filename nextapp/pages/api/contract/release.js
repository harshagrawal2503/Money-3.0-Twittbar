import ConnectToContract from '../../../helpers/contract';
import HttpErrorHandler, { HttpError } from '../../../helpers/HttpError';
import { userValidateSchema } from '../../../helpers/schema';
import { getSession } from "next-auth/react";
import { Hbar } from '@hashgraph/sdk';

export default async function handler(req, res) {
  HttpErrorHandler(req, res, {
    postFn: async () => releaseFund(await getSession({ req })),
  });
}

async function releaseFund({ user }) {
  const handle = user.username;
  const validate = userValidateSchema.validate({ handle }, { convert: true });
  if (validate.error)
    throw new HttpError(validate.error.message, 400);

  try {
    const { liveContract } = await ConnectToContract();
    console.log('LiveContract call: releaseFund()');
    const metaArgs = {
      // maxTransactionFee: new Hbar(1),
      transactionMemo: `@${validate.value.handle} Release Fund`,
      transactionValidDuration: 69,
      emitReceipt: true,
    };
    const data = await liveContract.releaseFund(metaArgs, validate.value.handle);
    console.log(data);
  } catch (error) {
    throw new HttpError(error.message, 400);
  }

  return {
    message: 'Ok',
  };
}
