/**
 *
 * Asynchronously loads the component for SpotTradingPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const SpotTradingPage = lazyLoad(
  () => import('./index'),
  module => module.SpotTradingPage,
  { fallback: <PageSkeleton /> },
);
