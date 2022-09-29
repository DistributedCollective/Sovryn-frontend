import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const PerpetualsPlaceholderPageLoadable = lazyLoad(
  () => import('./index'),
  module => module.PerpetualsPlaceholderPage,
  { fallback: <PageSkeleton /> },
);
