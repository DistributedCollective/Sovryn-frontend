/**
 *
 * Asynchronously loads the component for Layer2Page
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const Layer2Page = lazyLoad(
  () => import('./index'),
  module => module.Layer2Page,
  { fallback: <PageSkeleton /> },
);
