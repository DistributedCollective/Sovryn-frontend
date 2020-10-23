/**
 *
 * Asynchronously loads the component for TradeButton
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DialogButton = lazyLoad(
  () => import('./index'),
  module => module.DialogButton,
);
