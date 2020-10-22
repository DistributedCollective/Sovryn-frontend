/**
 *
 * Asynchronously loads the component for TradingPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const TradingPage = lazyLoad(
  () => import('./index'),
  module => module.TradingPage,
  { fallback: <PageSkeleton /> },
);
