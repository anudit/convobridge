import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Global, css } from '@emotion/react';
import Head from 'next/head'

import customTheme from '@/styles/theme';
import { RainbowContextProvider } from '@/contexts/RainbowContext';


const GlobalStyle = ({ children }) => {
  return (
    <>
      <Global
        styles={css`
          html {
            min-width: 360px;
            scroll-behavior: smooth;
          }
          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
          @font-face {
            font-family: 'GT Walsheim';
            font-style: normal;
            font-weight: 100;
            font-display: swap;
            src: url('/fonts/GTWalsheimPro-Regular.woff2') format('woff2');
          }
          @font-face {
            font-family: 'GT Walsheim';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/fonts/GTWalsheimPro-Medium.woff2') format('woff2');
          }
          @font-face {
            font-family: 'GT Walsheim';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('/fonts/GTWalsheimPro-Bold.woff2') format('woff2');
          }
          body {
            font-family: "GT Walsheim", "Segoe UI" !important;
          }
        `}
      />
      {children}
    </>
  );
};

const App = ({ Component, pageProps }) => {
  return (
      <ChakraProvider theme={customTheme} resetCSS>
    <RainbowContextProvider>
          <GlobalStyle/>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <Component {...pageProps} />
    </RainbowContextProvider>
      </ChakraProvider>
  )
}

export default App
