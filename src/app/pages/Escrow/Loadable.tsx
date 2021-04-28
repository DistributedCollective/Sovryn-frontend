import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const EscrowPage = lazyLoad(
  () => import('./index'),
  module => module.EscrowPage,
  { fallback: <PageSkeleton /> },
);
