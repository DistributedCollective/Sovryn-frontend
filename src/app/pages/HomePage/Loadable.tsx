import React from 'react';

import { PageSkeleton } from 'app/components/PageSkeleton';
import { lazyLoad } from 'utils/loadable';

export const HomePage = lazyLoad(
  () => import('./index'),
  module => module.HomePage,
  { fallback: <PageSkeleton /> },
);
