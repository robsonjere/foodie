import '@/styles/globals.css';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize auth store from localStorage
    useAuthStore.getState().initFromLocalStorage();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
