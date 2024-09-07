import React, { useState } from 'react'
import { TransactionId } from '@hashgraph/sdk'
import { toast } from 'react-toastify'
import axios from "axios"
import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'
import throttle from 'lodash.throttle'

export default function AppTransfer({ refreshComponent, setRefreshComponent }) {
  const [validHandle, setValidHandle] = useState(null);
  const [isProcessing, setProcessing] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    const username = event.target[0].value;
    const amount = parseFloat(event.target[1].value);

    if (confirm(`This transaction will be charged 1% fee.\nProceed to transfer ${amount} ℏ to "${username}"?`) === false)
      return;
    console.log(`Transfering to ${username} for ${amount}ℏ`);

    try {
      setProcessing(true);

      const { ApiSession, Contract } = window.strato;
      const { session } = await ApiSession.default({
        wallet: { type: 'Browser' },
        session: {
          emitLiveContractReceipts: true,
        }
      });

      const contractId = process.env.CONTRACT_ID; // TODO: to env
      const vaultContract = await Contract.newFrom({ path: './TwitterVaultAPI.sol' });
      const liveContract = await session.getLiveContract({ id: contractId, abi: vaultContract.interface });
      const receiptsSubscription = session.subscribeToReceiptsWith(
        ({ transaction, receipt }) => {
          axios.post('/api/transaction', {
            transactionId: `${transaction.transactionId}`,
            from: `${window.hedera.getAccountId()}`,
            to: username,
            timestamp: new Date().getTime(),
            amount: amount,
          })
            .then(() => setRefreshComponent(refreshComponent + 1));

          console.log(`Transaction ${transaction.transactionId} completed!`);
          toast.success(`Transaction ${transaction.transactionId} completed!`);
        }
      );

      const metaArgs = {
        amount: amount,
        // maxTransactionFee: new Hbar(1),
        transactionMemo: `Transfer to @${username}`,
        transactionValidDuration: 69,
        emitReceipt: true,
      };
      const data = await liveContract.transferFund(metaArgs, username);
      console.log(`Success TransactionId:`, data);
    } catch (error) {
      console.error(error.message || error.error);
      toast.error(error.message || error.error);
    } finally {
      setProcessing(false);
    }
  }

  const validateHandle = async (event) => {
    try {
      const params = { handle: event.target.value };
      const res = await axios.get('/api/validate', { params });
      setValidHandle(res.data);
    }
    catch (e) {
      setValidHandle(null);
    }
  }
  const throttleCheck = throttle(validateHandle, 3000, { trailing: true });

  return (
    <main className={styles.customForm}>
      <div className="mb-3 d-flex justify-content-center text-center">
        <form className="row" onSubmit={onSubmit}>
          <div className="col-md-5 mb-3">
            <label className="form-label">Twitter @handle</label>
            <input type="text"
              className="form-control" name="username"
              disabled={isProcessing}
              onChange={throttleCheck}
            />
            <div className="form-text">
              {
                validHandle === null
                  ? 'Invalid @handle'
                  : <React.Fragment>
                    Valid user:{' '}
                    {validHandle && validHandle.name}
                    {validHandle && validHandle.verified &&
                      <i className="bi bi-patch-check-fill text-primary mx-1"></i>
                    }
                  </React.Fragment>
              }
            </div>
          </div>
          <div className="col-md-5 mb-3">
            <label className="form-label">Amount in Hbar(ℏ)</label>
            <input type="number" step=".0001" className="form-control" name="amount" disabled={isProcessing} />
          </div>
          <div className="col-md-2 mt-3">
            <button type="submit"
              disabled={isProcessing}
              className="mt-3 btn btn-primary"
            // style={{ backgroundColor: "#464646" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}