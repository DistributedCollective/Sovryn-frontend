/**
 *
 * Asynchronously loads the component for BorrowHistory
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BorrowHistory = lazyLoad(
  () => import('./index'),
  module => module.BorrowHistory,
  { fallback: <PageSkeleton /> },
);
