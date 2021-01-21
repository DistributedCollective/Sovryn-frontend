/**
 *
 * Asynchronously loads the component for EngageWalletDialog
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EngageWalletDialog = lazyLoad(
  () => import('./index'),
  module => module.EngageWalletDialog,
);
