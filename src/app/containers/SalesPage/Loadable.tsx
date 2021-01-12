/**
 *
 * Asynchronously loads the component for WalletPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const SalesPage = lazyLoad(
  () => import('./index'),
  module => module.SalesPage,
  { fallback: <PageSkeleton /> },
);
