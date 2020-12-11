/**
 *
 * Asynchronously loads the component for TopUpBtcDialog
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopUpBtcDialog = lazyLoad(
  () => import('./index'),
  module => module.TopUpBtcDialog,
);
