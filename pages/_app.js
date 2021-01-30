import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import lightTheme from '../theme/light';
import darkTheme from '../theme/dark';

import Configure from './configure'

import stores from '../stores/index.js'

import {
  CONFIGURE,
  CONFIGURE_RETURNED,
  VAULTS_CONFIGURED,
  ACCOUNT_CONFIGURED,
  COVER_CONFIGURED,
} from '../stores/constants'

export default function MyApp({ Component, pageProps }) {
  const [ themeConfig, setThemeConfig ] = useState(lightTheme);
  const [ coverConfigured, setCoverConfigured ] = useState(false)
  const [ vaultConfigured, setVaultConfigured ] = useState(false)
  const [ accountConfigure, setAccountConfigured ] = useState(false)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const changeTheme = (dark) => {
    setThemeConfig(dark ? darkTheme : lightTheme)
    localStorage.setItem('yearn.finance-dark-mode', dark ? 'dark' : 'light')
  }

  const accountConfigureReturned = () => {
    setVaultConfigured(true)
  }

  const vaultsConfigureReturned = () => {
    setAccountConfigured(true)
  }

  const coverConfigureReturned = () => {
    setCoverConfigured(true)
  }

  useEffect(function() {
    const localStorageDarkMode = window.localStorage.getItem('yearn.finance-dark-mode')
    changeTheme(localStorageDarkMode ? localStorageDarkMode === 'dark' : false)
  },[]);

  useEffect(function() {
    stores.emitter.on(VAULTS_CONFIGURED, vaultsConfigureReturned)
    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigureReturned)
    stores.emitter.on(COVER_CONFIGURED, coverConfigureReturned)

    stores.dispatcher.dispatch({ type: CONFIGURE })
  },[]);

  return (
    <React.Fragment>
      <Head>
        <title>Yearn</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={ themeConfig }>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {
          vaultConfigured && accountConfigure && coverConfigured && <Component {...pageProps} changeTheme={ changeTheme } />
        }
        {
          !(vaultConfigured && accountConfigure && coverConfigured) && <Configure />
        }
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
