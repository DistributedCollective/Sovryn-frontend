/**
 *
 * Asynchronously loads the component for LimitsNotification
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LimitsNotification = lazyLoad(
  () => import('./index'),
  module => module.LimitsNotification,
);
