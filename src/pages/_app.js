import Head from 'next/head';

import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import theme from '../theme';
import '../../styles/global.css';

import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider session={pageProps.session}>
        <Head>
          <title>EMAILS | EFINFO</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={10}>
            <CssBaseline />
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
