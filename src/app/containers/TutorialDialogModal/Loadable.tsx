/**
 *
 * Asynchronously loads the component for TutorialDialogModal
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const TutorialDialogModal = lazyLoad(
  () => import('./index'),
  module => module.TutorialDialogModal,
  { fallback: <PageSkeleton /> },
);
