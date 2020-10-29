/**
 *
 * Asynchronously loads the component for TradeOrSwapTabs
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TradeOrSwapTabs = lazyLoad(
  () => import('./index'),
  module => module.TradeOrSwapTabs,
);
