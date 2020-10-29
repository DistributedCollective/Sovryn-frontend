/**
 *
 * Asynchronously loads the component for MarginTradeForm
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const MarginTradeForm = lazyLoad(
  () => import('./index'),
  module => module.MarginTradeForm,
  { fallback: <ComponentSkeleton lines={4} /> },
);
