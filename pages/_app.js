import React, { Fragment } from "react";
import App from "next/app";
import Head from "next/head";

import "../public/styles/app.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>Release Notes for Opencollective.</title>
        </Head>
        <Component {...pageProps} />
      </Fragment>
    );
  }
}

export default MyApp;
