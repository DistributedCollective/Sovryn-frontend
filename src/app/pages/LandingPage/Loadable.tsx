import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const LandingPage = lazyLoad(
  () => import('./index'),
  module => module.LandingPage,
  { fallback: <PageSkeleton /> },
);
