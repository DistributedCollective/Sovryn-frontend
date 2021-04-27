/**
 *
 * Asynchronously loads the component for SwapAssetSelector
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const SwapAssetSelector = lazyLoad(
  () => import('./index'),
  module => module.SwapAssetSelector,
  { fallback: <ComponentSkeleton /> },
);
