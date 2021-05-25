import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const LiquidityMiningPage = lazyLoad(
  () => import('./index'),
  module => module.LiquidityMining,
  { fallback: <PageSkeleton /> },
);
