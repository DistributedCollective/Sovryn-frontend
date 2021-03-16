/**
 *
 * Asynchronously loads the component for WalletPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BuyBTCPage = lazyLoad(
  () => import('./index'),
  module => module.BuyBTCPage,
  { fallback: <PageSkeleton /> },
);
