/**
 *
 * Asynchronously loads the component for SwapPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const SwapPage = lazyLoad(
  () => import('./index'),
  module => module.SwapPage,
  { fallback: <PageSkeleton /> },
);
