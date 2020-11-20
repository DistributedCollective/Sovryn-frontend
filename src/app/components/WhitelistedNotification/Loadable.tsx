/**
 *
 * Asynchronously loads the component for WhitelistedNotification
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WhitelistedNotification = lazyLoad(
  () => import('./index'),
  module => module.WhitelistedNotification,
);
