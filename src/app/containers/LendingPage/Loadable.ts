/**
 *
 * Asynchronously loads the component for LendingPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LendingPage = lazyLoad(
  () => import('./index'),
  module => module.LendingPage,
);
