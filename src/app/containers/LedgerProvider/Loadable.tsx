/**
 *
 * Asynchronously loads the component for LedgerProvider
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const LedgerProvider = lazyLoad(
  () => import('./index'),
  module => module.LedgerProvider,
  { fallback: <PageSkeleton /> },
);
