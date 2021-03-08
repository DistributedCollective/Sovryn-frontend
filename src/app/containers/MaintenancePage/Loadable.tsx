/**
 *
 * Asynchronously loads the component for MaintenancePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const MaintenancePage = lazyLoad(
  () => import('./index'),
  module => module.MaintenancePage,
  { fallback: <PageSkeleton /> },
);
