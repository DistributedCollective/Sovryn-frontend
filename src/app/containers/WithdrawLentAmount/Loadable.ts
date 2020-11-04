/**
 *
 * Asynchronously loads the component for WithdrawLentAmount
 *
 */

import { lazyLoad } from 'utils/loadable';

/**
 * @deprecated
 */
export const WithdrawLentAmount = lazyLoad(
  () => import('./index'),
  module => module.WithdrawLentAmount,
);
