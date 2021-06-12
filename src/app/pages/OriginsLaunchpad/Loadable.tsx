import React from 'react';
import { lazyLoad } from '../../../utils/loadable';
import { PageSkeleton } from '../../components/PageSkeleton';

export const OriginsLaunchpadPage = lazyLoad(
  () => import('./index'),
  module => module.OriginsLaunchpad,
  { fallback: <PageSkeleton /> },
);
