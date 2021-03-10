/**
 *
 * Asynchronously loads the component for MarginTradePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const MarginTradePage = lazyLoad(
  () => import('./index'),
  module => module.MarginTradePage,
  { fallback: <PageSkeleton /> },
);
