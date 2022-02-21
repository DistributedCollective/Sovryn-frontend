/**
 *
 * Asynchronously loads the component for MarginTradePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const PerpetualPageLoadable = lazyLoad(
  () => import('./index'),
  module => module.PerpetualPage,
  { fallback: <PageSkeleton /> },
);
