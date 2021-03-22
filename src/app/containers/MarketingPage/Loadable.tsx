/**
 *
 * Asynchronously loads the component for MarketingPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const MarketingPage = lazyLoad(
  () => import('./index'),
  module => module.MarketingPage,
  { fallback: <PageSkeleton /> },
);
