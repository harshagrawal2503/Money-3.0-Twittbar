import Head from 'next/head'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import AppTransfer from '../components/AppTransfer'
import AppRecent from '../components/AppRecent'
import { ToastContainer, toast } from 'react-toastify'
import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'
import { isHashpackConnected } from '../helpers/utils';

export default function Home() {
  const router = useRouter();
  const [refreshComponent, setRefreshComponent] = useState(0);

  useEffect(() => {
    if (!isHashpackConnected())
      router.push({ pathname: '/' });
  }, []);

  return (
    <div className={styles.body}>
      <Head>
        <title>Home | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container py-3">
        <AppHeader />
        <AppTransfer refreshComponent={refreshComponent} setRefreshComponent={setRefreshComponent} />
        <AppRecent refreshComponent={refreshComponent} />
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
