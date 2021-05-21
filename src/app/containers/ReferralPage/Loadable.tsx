/**
 *
 * Asynchronously loads the component for ReferralPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from '../../components/PageSkeleton';

export const ReferralPage = lazyLoad(
  () => import('./index'),
  module => module.ReferralPage,
  { fallback: <PageSkeleton /> },
);
