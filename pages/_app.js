import React, { Fragment } from "react";
import App from "next/app";
import Head from "next/head";

import "../public/styles/app.css";
import { ThemeProvider } from "styled-components";
import theme from "@bit/opencollective.design-system.theme";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <ThemeProvider theme={theme}>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <title>Release Notes for Open Collective.</title>
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </Fragment>
    );
  }
}

export default MyApp;
