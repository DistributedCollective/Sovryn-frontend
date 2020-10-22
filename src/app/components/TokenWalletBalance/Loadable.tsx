/**
 * Asynchronously loads the component for TokenWalletBalance
 */

import { lazyLoad } from 'utils/loadable';

export const TokenWalletBalance = lazyLoad(
  () => import('./index'),
  module => module.TokenWalletBalance,
);
