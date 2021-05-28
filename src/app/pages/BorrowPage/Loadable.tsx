/**
 *
 * Asynchronously loads the component for EmailOptInSuccessPage
 *
 */

import React from 'react';

import { PageSkeleton } from 'app/components/PageSkeleton';
import { lazyLoad } from 'utils/loadable';

export const BorrowPage = lazyLoad(
  () => import('./index'),
  module => module.BorrowPage,
  { fallback: <PageSkeleton /> },
);
