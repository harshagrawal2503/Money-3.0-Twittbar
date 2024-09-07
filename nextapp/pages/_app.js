import Head from "next/head";
import Script from "next/script";
import { SessionProvider } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import RouteGuard from '../components/RouteGuard';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script src="/hedera-strato-hashpack-esm.js" type="module" />
      <Script src="/app.mjs" type="module" />
      <SessionProvider session={pageProps.session}>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </SessionProvider>
    </>
  );
}

export default MyApp
