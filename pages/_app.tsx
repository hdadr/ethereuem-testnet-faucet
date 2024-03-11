import { CacheProvider } from '@emotion/react';
import { EmotionCache } from '@emotion/utils';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { store } from '../store';
import createEmotionCache from '../utils/createEmotionCache';
import { darkTheme } from '../utils/createTheme';

const clientSideEmotionCache = createEmotionCache();

const Web3ReactProviderDefault = dynamic(() => import("../components/Web3providerWithNoSSR"), { ssr: false });

const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

type Props = AppProps & { emotionCache: EmotionCache };

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: Props) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Ethereum Faucet</title>
        <meta name="description" content="Faucet for ethereum testnets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ReactProviderDefault getLibrary={getLibrary}>
              <Component {...pageProps} />
            </Web3ReactProviderDefault>
          </Web3ReactProvider>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
