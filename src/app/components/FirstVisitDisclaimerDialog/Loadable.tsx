/**
 *
 * Asynchronously loads the component for FirstVisitDisclaimerDialog
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FirstVisitDisclaimerDialog = lazyLoad(
  () => import('./index'),
  module => module.FirstVisitDisclaimerDialog,
);
