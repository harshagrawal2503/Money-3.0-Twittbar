import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { isHashpackConnected } from '../helpers/utils';

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // on initial load - run auth check 
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false  
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check 
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in 
    const publicPaths = ['/login', '/wallet', '/twitter'];
    const path = url.split('?')[0];
    // if (localStorage.getItem('hashpack-session') !== null) {
    //   await new Promise(resolve => {
    //     console.log('Loading from "hashpack-session"');
    //     const timer = setInterval(() => {
    //       if (window.connectToHashPack == null || window.strato == null)
    //         return; // wait for app.mjs to load finish

    //       console.log('hashpack lib is ready...');
    //       clearInterval(timer);
    //       resolve();
    //     }, 300);
    //   });
    //   await window.connectToHashPack();
    // }

    if ((!isHashpackConnected() || !session) && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        // query: { returnUrl: router.asPath }
      });
    }
    else {
      setAuthorized(true);
    }
  }

  return (authorized && children);
}