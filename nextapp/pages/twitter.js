import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Hbar } from '@hashgraph/sdk'
import styles from '../styles/Home.module.css'
import AppFooter from '../components/AppFooter'
import { timeSince } from '../helpers/utils'

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const processing = useState(false);

  useEffect(() => {
    if (!session)
      router.push({ pathname: '/' });
  }, [session]);

  return (
    <div className={styles.body}>
      <Head>
        <title>Twitter | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container py-3">
        <AppHeader />
        <AppBody processing={processing}/>
        <AppRecent />
        <AppFooter />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
      </div>
    </div>
  )
}

function AppHeader() {
  return (
    <header>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <Link href="/" className="d-flex align-items-center text-dark text-decoration-none">
          <span className="fs-4">Home <small className='text-muted'>testnet</small></span>
        </Link>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          <button className="btn btn-light py-2 text-dark" onClick={signOut}>Logout</button>
        </nav>
      </div>
      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-4 fw-normal">TwittBar</h1>
        <p className="fs-5 text-muted">Make Hbar (ℏ) transfer simple via Twitter@handle</p>
      </div>
    </header>
  );
}

function AppBody({ processing }) {
  const [isProcessing, setProcessing] = processing;

  const onMapAccount = async (event) => {
    event.preventDefault();
    try {
      setProcessing(true);
      const account = document.getElementsByName('accountId')[0].value;
      await axios.post('/api/contract/map', { account });
      toast.success(`Successfully map account.`);
    } catch (error) {
      console.error(error.message || error.error);
      toast.error(error.message || error.error);
    } finally {
      setProcessing(false);
    }
  }

  const onReleaseFund = async (event) => {
    event.preventDefault();
    try {
      setProcessing(true);
      await axios.post('/api/contract/release');
      toast.success(`Successfully release pending fund.`);
    } catch (error) {
      console.log(error.message || error.error);
      toast.error(error.message || error.error);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className={styles.customForm}>
      <div className='d-flex justify-content-center'>
        <div className='text-center'>
          <h4>How to receive the Fund</h4>
          <div>1. <a
            href="https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk"
            rel="noreferrer"
            target="_blank">
            Install Hashpack extension
          </a></div>
          <div>2. <a
            href="https://www.hashpack.app/post/how-to-create-your-first-account-with-hashpack"
            rel="noreferrer"
            target="_blank"
          >
            Create your first account with HashPack
          </a></div>
          <div>3. Paste your Hedera <strong><i>Account Id</i></strong> here.</div>
          <input type="text" style={{ width: '300px' }}
            className="form-control" name="accountId"
            disabled={isProcessing}
            placeholder='eg. 0.0.312334'
          />
          <div className="btn-group">
            <button className="mt-3 btn btn-secondary" onClick={onMapAccount}  disabled={isProcessing}>
              Map Account
            </button>
            <button className="mt-3 btn btn-primary" onClick={onReleaseFund}  disabled={isProcessing}>
              Release Fund
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function AppRecent() {
  const { data: session } = useSession();
  const limit = 3;
  const [skip, setSkip] = useState(0);
  const [transactions, setTransactions] = useState([]);
  
  const fetchData = async ({ skip, limit }) => {
    if (!session)
      return [];

    const params = {
      skip,
      limit,
      to: `${session.user.username}`
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
  }, [])

  
  return (<div className='mt-5'>
    <div className="d-flex justify-content-center flex-row">
      <h5>Received Fund:</h5>
    </div>
    <div className='d-flex justify-content-center pb-5'>
      <div className="list-group" style={{ maxWidth: '570px' }}>
        {
          transactions.map(({ transactionId, from, to, amount, timestamp }, index) => {
            const transactionPath = transactionId.split('@').join('').split('.').join('');
            const profileImage = "/black-cutout.png";

            return (
              <div
                key={transactionId}
                href={`https://testnet.dragonglass.me/transactions/${transactionPath}`}
                className="list-group-item list-group-item-action d-flex gap-3 py-3"
                aria-current="true"
                target="_blank"
              >
                <Image src={profileImage} width={48} height={32} className="rounded-circle flex-shrink-0" />
                <div className="d-flex gap-2 w-100 justify-content-between">
                  <div>
                    <h6 className="mb-0">
                      {`${new Hbar(amount).toString()} from `}
                      <a href={`https://testnet.dragonglass.me/hedera/accounts/${from}`} rel="noreferrer" target="_blank">
                        <strong><i>{from}</i></strong>
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
  </div>);
}