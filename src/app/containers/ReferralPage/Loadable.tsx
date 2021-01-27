/**
 *
 * Asynchronously loads the component for Referral page
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const EmailPage = lazyLoad(
  () => import('./index'),
  module => module.ReferralPage,
  { fallback: <PageSkeleton /> },
);
