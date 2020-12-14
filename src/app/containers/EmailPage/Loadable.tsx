/**
 *
 * Asynchronously loads the component for EmailOptInSuccessPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const EmailPage = lazyLoad(
  () => import('./index'),
  module => module.EmailPage,
  { fallback: <PageSkeleton /> },
);
