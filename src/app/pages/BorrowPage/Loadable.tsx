/**
 *
 * Asynchronously loads the component for EmailOptInSuccessPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BorrowPage = lazyLoad(
  () => import('./index'),
  module => module.default,
  { fallback: <PageSkeleton /> },
);
