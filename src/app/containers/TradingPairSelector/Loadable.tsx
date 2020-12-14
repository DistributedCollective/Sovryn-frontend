/**
 *
 * Asynchronously loads the component for TradingPairSelector
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const TradingPairSelector = lazyLoad(
  () => import('./index'),
  module => module.TradingPairSelector,
  { fallback: <ComponentSkeleton /> },
);
