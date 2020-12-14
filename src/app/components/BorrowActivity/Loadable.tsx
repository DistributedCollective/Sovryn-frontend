/**
 *
 * Asynchronously loads the component for BorrowActivity
 *
 */

import { lazyLoad } from 'utils/loadable';

export const BorrowActivity = lazyLoad(
  () => import('./index'),
  module => module.BorrowActivity,
);
