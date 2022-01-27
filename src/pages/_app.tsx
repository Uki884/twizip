import 'semantic-ui-css/semantic.min.css'
import React, { useEffect } from 'react'
import { withTRPC } from '@trpc/next';
import { AppRouter } from '@/pages/api/trpc/[trpc]';
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

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  ssr: false,
})(MyApp);