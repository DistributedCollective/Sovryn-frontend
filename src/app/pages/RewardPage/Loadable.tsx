import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const RewardPage = lazyLoad(
  () => import('./index'),
  module => module.RewardPage,
  { fallback: <PageSkeleton /> },
);
