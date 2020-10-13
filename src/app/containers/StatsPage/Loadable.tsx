/**
 *
 * Asynchronously loads the component for StatsPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const StatsPage = lazyLoad(
  () => import('./index'),
  module => module.StatsPage,
  { fallback: <PageSkeleton /> },
);
