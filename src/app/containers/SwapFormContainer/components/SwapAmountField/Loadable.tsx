/**
 *
 * Asynchronously loads the component for SwapAmountField
 *
 */
import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const AmountField = lazyLoad(
  () => import('./index'),
  module => module.AmountField,
  { fallback: <ComponentSkeleton /> },
);
