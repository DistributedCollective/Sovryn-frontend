/**
 *
 * Asynchronously loads the component for Dialog
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Dialog = lazyLoad(
  () => import('./index'),
  module => module.Dialog,
);
