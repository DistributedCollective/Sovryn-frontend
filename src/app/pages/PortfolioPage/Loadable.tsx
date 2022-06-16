import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const PortfolioPage = lazyLoad(
  () => import('./index'),
  module => module.PortfolioPage,
  { fallback: <PageSkeleton /> },
);
