/**
 *
 * Asynchronously loads the component for TopUpTradingPositionHandler
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopUpTradingPositionHandler = lazyLoad(
  () => import('./index'),
  module => module.TopUpTradingPositionHandler,
);
