/**
 *
 * Asynchronously loads the component for SwapPage
 *
 */
import React from 'react';

import { PageSkeleton } from 'app/components/PageSkeleton';
import { lazyLoad } from 'utils/loadable';

export const SwapPage = lazyLoad(
  () => import('./index'),
  module => module.SwapPage,
  { fallback: <PageSkeleton /> },
);
