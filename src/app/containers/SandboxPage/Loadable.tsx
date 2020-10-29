/**
 *
 * Asynchronously loads the component for SandboxPage
 *
 */

import React from 'react';
import { lazyLoad } from 'utils/loadable';
import { PageSkeleton } from '../../components/PageSkeleton';

export const SandboxPage = lazyLoad(
  () => import('./index'),
  module => module.SandboxPage,
  { fallback: <PageSkeleton /> },
);
