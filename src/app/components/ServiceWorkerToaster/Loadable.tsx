/**
 *
 * Asynchronously loads the component for ServiceWorkerToaster
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ServiceWorkerToaster = lazyLoad(
  () => import('./index'),
  module => module.ServiceWorkerToaster,
);
