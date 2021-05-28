/**
 *
 * Asynchronously loads the component for SwapAssetSelector
 *
 */

import React from 'react';

import { ComponentSkeleton } from 'app/components/PageSkeleton';
import { lazyLoad } from 'utils/loadable';

export const AssetSelector = lazyLoad(
  () => import('./index'),
  module => module.AssetSelector,
  { fallback: <ComponentSkeleton /> },
);
