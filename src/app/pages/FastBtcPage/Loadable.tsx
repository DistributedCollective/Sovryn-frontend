import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const FastBtcPage = lazyLoad(
  () => import('./index'),
  module => module.FastBtcPage,
  { fallback: <PageSkeleton /> },
);
