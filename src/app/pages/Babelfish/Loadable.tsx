import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const Babelfish = lazyLoad(
  () => import('./index'),
  module => module.Babelfish,
  { fallback: <PageSkeleton /> },
);
