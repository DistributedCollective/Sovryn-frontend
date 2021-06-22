/**
 *
 * Asynchronously loads the component for BridgeWithdrawPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BridgeWithdrawPage = lazyLoad(
  () => import('./index'),
  module => module.BridgeWithdrawPage,
  { fallback: <PageSkeleton /> },
);
