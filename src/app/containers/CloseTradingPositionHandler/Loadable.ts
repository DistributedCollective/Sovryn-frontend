/**
 *
 * Asynchronously loads the component for CloseTradingPositionHandler
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CloseTradingPositionHandler = lazyLoad(
  () => import('./index'),
  module => module.CloseTradingPositionHandler,
);
