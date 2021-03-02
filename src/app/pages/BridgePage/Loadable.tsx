/**
 *
 * Asynchronously loads the component for BridgePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BridgePage = lazyLoad(
  () => import('./index'),
  module => module.BridgePage,
  { fallback: <PageSkeleton /> },
);
