import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BridgeDepositPage = lazyLoad(
  () => import('./index'),
  module => module.BridgeDepositPage,
  { fallback: <PageSkeleton /> },
);
