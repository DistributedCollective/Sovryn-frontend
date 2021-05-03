import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const BuySovPage = lazyLoad(
  () => import('./index'),
  module => module.BuySovPage,
  { fallback: <PageSkeleton /> },
);
