import 'semantic-ui-css/semantic.min.css'
import React, { useEffect } from 'react'
import App from "next/app";
import BaseLayout from '@/components/Layouts/BaseLayout'

import { RecoilRoot } from 'recoil'

const MyApp = (props: any): any => {
  const { Component, pageProps } = props;
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/worker.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
    }
  }, [])
  return (
    <RecoilRoot>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </RecoilRoot>
  );
}

export default MyApp;