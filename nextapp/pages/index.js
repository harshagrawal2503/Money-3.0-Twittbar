import Head from 'next/head'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  return (
    <div className={styles.body}>
      <Head>
        <title>Home | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container py-3">
        <AppHeader />
        <AppFooter />
      </div>

    </div>
  )
}
