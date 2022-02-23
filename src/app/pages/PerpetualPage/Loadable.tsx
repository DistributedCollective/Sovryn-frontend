import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const PerpetualPageLoadable = lazyLoad(
  () => import('./index'),
  module => module.PerpetualPage,
  { fallback: <PageSkeleton /> },
);
