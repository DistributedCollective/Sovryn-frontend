/**
 *
 * Asynchronously loads the component for LendingPage
 *
 */

import { lazyLoad } from 'utils/loadable';

/**
 * @deprecated
 */
export const UnLendBalance = lazyLoad(
  () => import('./index'),
  module => module.UnLendBalance,
);
