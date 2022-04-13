/**
 *
 * Asynchronously loads the component for SwapSelector
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const SwapSelector = lazyLoad(
  () => import('./index'),
  module => module.SwapSelector,
  { fallback: <ComponentSkeleton /> },
);
