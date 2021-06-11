import 'semantic-ui-css/semantic.min.css'
import React from 'react'
import App from "next/app";
import BaseLayout from '@/components/Layouts/BaseLayout'

import { RecoilRoot } from 'recoil'
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <RecoilRoot>
        <BaseLayout>
          <Component {...pageProps} />
        </BaseLayout>
      </RecoilRoot>
    );
  }
}

export default MyApp;