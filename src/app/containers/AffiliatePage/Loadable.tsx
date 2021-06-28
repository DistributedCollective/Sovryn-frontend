/**
 *
 * Asynchronously loads the component for AffiliatePage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from '../../components/PageSkeleton';

export const AffiliatePage = lazyLoad(
  () => import('./index'),
  module => module.AffiliatePage,
  { fallback: <PageSkeleton /> },
);
