/**
 *
 * Asynchronously loads the component for FastBtcForm
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const FastBtcForm = lazyLoad(
  () => import('./index'),
  module => module.FastBtcForm,
  { fallback: <PageSkeleton /> },
);
