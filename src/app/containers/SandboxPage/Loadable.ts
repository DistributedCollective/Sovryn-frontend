/**
 *
 * Asynchronously loads the component for SandboxPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SandboxPage = lazyLoad(
  () => import('./index'),
  module => module.SandboxPage,
);
