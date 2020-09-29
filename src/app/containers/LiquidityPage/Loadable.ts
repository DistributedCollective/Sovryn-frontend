/**
 *
 * Asynchronously loads the component for LiquidityPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LiquidityPage = lazyLoad(
  () => import('./index'),
  module => module.LiquidityPage,
);
