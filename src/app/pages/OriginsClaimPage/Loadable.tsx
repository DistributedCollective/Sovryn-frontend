import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const OriginsClaimPage = lazyLoad(
  () => import('./index'),
  module => module.OriginsClaimPage,
  { fallback: <PageSkeleton /> },
);
