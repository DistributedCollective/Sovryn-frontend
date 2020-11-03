/**
 *
 * Asynchronously loads the component for RepayPositionHandler
 *
 */

import { lazyLoad } from 'utils/loadable';

export const RepayPositionHandler = lazyLoad(
  () => import('./index'),
  module => module.RepayPositionHandler,
);
