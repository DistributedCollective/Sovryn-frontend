/**
 *
 * Asynchronously loads the component for TutorialDialogModal
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from 'app/components/PageSkeleton';

export const TutorialSOVModal = lazyLoad(
  () => import('./index'),
  module => module.TutorialSOVModal,
  { fallback: <PageSkeleton /> },
);
