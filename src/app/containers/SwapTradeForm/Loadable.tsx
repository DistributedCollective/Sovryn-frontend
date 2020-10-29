/**
 *
 * Asynchronously loads the component for SwapTradeForm
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const SwapTradeForm = lazyLoad(
  () => import('./index'),
  module => module.SwapTradeForm,
  { fallback: <ComponentSkeleton lines={4} /> },
);
