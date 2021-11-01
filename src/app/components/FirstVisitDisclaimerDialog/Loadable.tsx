import { lazyLoad } from 'utils/loadable';

export const FirstVisitDisclaimerDialog = lazyLoad(
  () => import('./index'),
  module => module.FirstVisitDisclaimerDialog,
);
