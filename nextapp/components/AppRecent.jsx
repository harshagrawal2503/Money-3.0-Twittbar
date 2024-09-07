import axios from 'axios';
import { useEffect, useState } from 'react'
import { Hbar } from '@hashgraph/sdk'
import { timeSince, isHashpackConnected } from '../helpers/utils'

export default function AppRecent({ refreshComponent }) {
  const limit = 3;
  const [skip, setSkip] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async ({ skip, limit }) => {
    if (isHashpackConnected() === false)
      return [];

    const params = {
      skip,
      limit,
      from: `${window.hedera.account.id}`
    };
    const res = await axios.get('/api/transaction', { params });
    return res.data;
  }

  const loadMore = async () => {
    if (skip === -1)
      return;

    const _skip = skip + limit; // due to delay from the set function
    setSkip(_skip);
    const data = await fetchData({ skip: _skip, limit });
    if (data.length === 0)
      setSkip(-1)

    const trxs = transactions.concat(data);
    setTransactions(trxs);
  }

  useEffect(() => {
    async function load() {
      // reset
      const _skip = 0; // due to delay from the set function
      setSkip(_skip);
      const data = await fetchData({ skip: _skip, limit });
      setTransactions(data);
    }
    load();
  }, [refreshComponent])

  return (<>
    <div className="d-flex justify-content-center flex-row">
      <h5>Recent Transfer:</h5>
    </div>
    <div className='d-flex justify-content-center pb-5'>
      <div className="list-group" style={{ maxWidth: '570px' }}>
        {
          transactions.map(({ transactionId, from, to, amount, timestamp, twitter }, index) => {
            const transactionPath = transactionId.split('@').join('').split('.').join('');
            const profileImage = (twitter && twitter.profile_image_url) || "/black-cutout.png";

            return (
              <div
                key={transactionId}
                href={`https://testnet.dragonglass.me/transactions/${transactionPath}`}
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
                target="_blank"
              >
                <img src={profileImage} alt="twbs" width="32" height="32" className="rounded-circle flex-shrink-0" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mb-0">
                      {`${new Hbar(amount).toString()} to `}
                      <a href={`https://twitter.com/${to}`} rel="noreferrer" target="_blank">
                        <strong><i>{to}</i></strong>
                        {
                          twitter && twitter.verified &&
                          <i className="bi bi-patch-check-fill text-primary mx-1"></i>
                        }
                      </a>
                    </h6>
                    <div className="mb-0 mt-1 opacity-75"><pre className='mb-0'>{transactionId}</pre></div>
                  </div>
                  <small className="opacity-50 text-nowrap">{timeSince(new Date(timestamp)) + ' ago'}</small>
                </div>
              </div>
            );
          })
        }
        {
          transactions.length === 0 || skip === -1 ? null :
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3" onClick={loadMore}>
              <div className="d-flex gap-2 w-100 justify-content-center">
                <small className="opacity-50 text-nowrap">more...</small>
              </div>
            </div>
        }
      </div>
    </div>
  </>);
}