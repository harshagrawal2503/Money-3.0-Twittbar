import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isHashpackConnected } from '../helpers/utils';

export default function AppHeader() {
  const router = useRouter();
  const [accountBalance, setAccountbalance] = useState('0 ℏ');

  useEffect(() => {
    async function fetchData() {
      if (isHashpackConnected() === false)
        return;

      const wallet = await window.hedera.getAccountBalance();
      setAccountbalance(wallet.hbars.toString());
    }
    const timer = setInterval(fetchData, 1500);
    return () => clearInterval(timer);
  }, []);

  const onLogout = async () => {
    if (isHashpackConnected() === false)
      return;
    window.hedera.wipePairingData();
    router.push({ pathname: '/login' });
  }

  return (
    <header>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <Link href="/" className="d-flex align-items-center text-dark text-decoration-none">
          <span className="fs-4">Home <small className='text-muted'>testnet</small></span>
        </Link>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          <span className="py-2 me-3 text-primary text-decoration-none">Balance {accountBalance}</span>
          <button className="btn btn-light py-2 text-dark" onClick={onLogout}>Logout</button>
        </nav>
      </div>

      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-4 fw-normal">TwittBar</h1>
        <p className="fs-5 text-muted">Make Hbar (ℏ) transfer simple via Twitter@handle</p>
      </div>
    </header>
  );
}