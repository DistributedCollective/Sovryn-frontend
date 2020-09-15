/**
 *
 * Asynchronously loads the component for WithdrawLentAmount
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WithdrawLentAmount = lazyLoad(
  () => import('./index'),
  module => module.WithdrawLentAmount,
);
