/**
 *
 * Asynchronously loads the component for LiquidityPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const LiquidityPage = lazyLoad(
  () => import('./index'),
  module => module.LiquidityPage,
  { fallback: <PageSkeleton /> },
);
