import { lazyLoad } from 'utils/loadable';

export const PromotionModal = lazyLoad(
  () => import('./index'),
  module => module.PromotionModal,
);
