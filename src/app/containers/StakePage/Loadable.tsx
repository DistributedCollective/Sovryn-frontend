/**
 *
 * Asynchronously loads the component for StakePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const StakePage = lazyLoad(
  () => import('./index'),
  module => module.StakePage,
  { fallback: <PageSkeleton /> },
);
