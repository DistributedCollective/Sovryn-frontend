/**
 *
 * Asynchronously loads the component for MetaMaskDiscouragementNotifyModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MetaMaskDiscouragementNotifyModal = lazyLoad(
  () => import('./index'),
  module => module.MetaMaskDiscouragementNotifyModal,
);
