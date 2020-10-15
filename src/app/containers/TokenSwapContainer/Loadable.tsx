/**
 *
 * Asynchronously loads the component for TokenSwapContainer
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TokenSwapContainer = lazyLoad(
  () => import('./index'),
  module => module.TokenSwapContainer,
);
