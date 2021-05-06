import React, { lazy, Suspense } from 'react';

interface Opts {
  fallback: React.ReactNode;
}
type Unpromisify<T> = T extends Promise<infer P> ? P : never;

export const lazyLoad = <
  T extends Promise<any>,
  U extends React.ComponentType<any>
>(
  importFunc: () => T,
  selectorFunc?: (s: Unpromisify<T>) => U,
  opts: Opts = { fallback: null },
) => {
  let lazyFactory: () => Promise<{ default: U }> = importFunc;

  if (selectorFunc) {
    lazyFactory = () =>
      importFunc()
        .then(module => ({ default: selectorFunc(module) }))
        .catch(reason => {
          if (/Loading chunk [\d]+ failed/.test(reason.message)) {
            alert(
              "dApp failed to load, let's try again.\nIt may be an issue with an internet connection.",
            );

            fetch(`/clear-site-data`).finally(() =>
              window.location.replace(window.location.href),
            );
          }
          return reason;
        });
  }

  const LazyComponent = lazy(lazyFactory);

  return (props: React.ComponentProps<U>): JSX.Element => (
    <Suspense fallback={opts.fallback!}>
      <LazyComponent {...props} />
    </Suspense>
  );
};
