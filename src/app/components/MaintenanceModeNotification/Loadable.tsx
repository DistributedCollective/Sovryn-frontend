/**
 *
 * Asynchronously loads the component for MaintenanceModeNotification
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MaintenanceModeNotification = lazyLoad(
  () => import('./index'),
  module => module.MaintenanceModeNotification,
);
