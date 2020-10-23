/**
 *
 * Asynchronously loads the component for AmountField
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AmountField = lazyLoad(
  () => import('./index'),
  module => module.AmountField,
);
