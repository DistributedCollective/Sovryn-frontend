/**
 *
 * Asynchronously loads the component for TradePage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TradingHistoryPage = lazyLoad(
  () => import('./index'),
  module => module.TradingHistoryPage,
);
