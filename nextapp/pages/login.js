import Head from 'next/head'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../styles/Signin.module.css'
import { signIn, signOut, useSession, } from 'next-auth/react';

export default function Signin() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const { data: session } = useSession();

  const onWalletSignIn = async () => {
    try {
      if (window.connectToHashPack == null) {
        const interval = setTimeout(() => {
          setErrorMsg('');
          clearTimeout(interval);
        }, 3000);
        throw "Please wait. Initializing component...";
      }
      await window.connectToHashPack();
      router.push('/wallet');
    } catch (error) {
      setErrorMsg(error);
      console.error(error);
    }
  }

  useEffect(() => {
    if (session)
      router.push('/twitter');
  }, [session]);

  return (
    <div className={styles.body}>
      <Head>
        <title>Login | Twittbar</title>
        <meta name="description" content="Transfer Hbar(ℏ) via Twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.formSignin}>
        <form>
          <h1 className="mb-1 fw-normal">TwittBar</h1>
          <p className="w-100 mb-3">Make transfer simple via Twitter@handle and smart contract</p>
          <div className="">Send Hbar(ℏ)</div>
          <div className="w-100 btn btn-lg btn-primary" onClick={onWalletSignIn}>Connect Wallet</div>
          {
            errorMsg && <div className='text-danger mt-2'>{errorMsg}</div>
          }
          <div className="mt-3">Receive Hbar(ℏ)</div>
          {
            !session
              ? <div className="w-100 btn btn-lg btn-primary" onClick={signIn}>Sign in to Twitter</div>
              : <div className="w-100 btn btn-lg btn-primary" onClick={signOut}>Sign out from Twitter</div>
          }
          <div className='my-5'>
          <Image className="mt-1" src="/built-on-hedera.png" alt="" width={120} height={60} objectFit={'contain'}/>
          <p className="text-muted">Harsh Agrawal & B.Venkatesh &copy; 2024</p>
          </div>
        </form>
      </main>
    </div>
  )
}
