/**
 *
 * Asynchronously loads the component for DummyField
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DummyField = lazyLoad(
  () => import('./index'),
  module => module.DummyField,
);
