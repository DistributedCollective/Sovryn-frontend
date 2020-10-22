/**
 *
 * Asynchronously loads the component for FieldGroup
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FieldGroup = lazyLoad(
  () => import('./index'),
  module => module.FieldGroup,
);
