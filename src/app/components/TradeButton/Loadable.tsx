/**
 *
 * Asynchronously loads the component for TradeButton
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TradeButton = lazyLoad(
  () => import('./index'),
  module => module.TradeButton,
);
