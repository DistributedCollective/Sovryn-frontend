/**
 *
 * Asynchronously loads the component for TutorialDialogModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TutorialDialogModal = lazyLoad(
  () => import('./index'),
  module => module.TutorialDialogModal,
);
