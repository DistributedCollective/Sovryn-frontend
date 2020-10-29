/**
 *
 * Asynchronously loads the component for TradingActivity
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from 'app/components/PageSkeleton';

export const TradingActivity = lazyLoad(
  () => import('./index'),
  module => module.TradingActivity,
  { fallback: <ComponentSkeleton lines={3} /> },
);
