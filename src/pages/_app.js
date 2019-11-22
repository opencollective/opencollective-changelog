import React, { Fragment } from "react";
import App from "next/app";
import Head from "next/head";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <Head>
          <title>Release Notes for Opencollective.</title>
        </Head>
        <Component {...pageProps} />
      </Fragment>
    );
  }
}

export default MyApp;
