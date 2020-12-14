/**
 *
 * Asynchronously loads the component for FastBtcForm
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FastBtcForm = lazyLoad(
  () => import('./index'),
  module => module.FastBtcForm,
);
