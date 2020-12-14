/**
 * Asynchronously loads the component for TokenWalletBalance
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { ComponentSkeleton } from '../PageSkeleton';

export const TokenWalletBalance = lazyLoad(
  () => import('./index'),
  module => module.TokenWalletBalance,
  { fallback: <ComponentSkeleton /> },
);
