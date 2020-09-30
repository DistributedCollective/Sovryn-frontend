/**
 *
 * Asynchronously loads the component for TradePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const TradePage = lazyLoad(
  () => import('./index'),
  module => module.TradePage,
  { fallback: <PageSkeleton /> },
);
