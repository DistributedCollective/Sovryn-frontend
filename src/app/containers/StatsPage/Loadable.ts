/**
 *
 * Asynchronously loads the component for StatsPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const StatsPage = lazyLoad(
  () => import('./index'),
  module => module.StatsPage,
);
