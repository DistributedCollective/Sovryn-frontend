/**
 *
 * Asynchronously loads the component for LendingPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const LendingPage = lazyLoad(
  () => import('./index'),
  module => module.default,
  { fallback: <PageSkeleton /> },
);
