import type { FunctionComponent } from 'react';

export interface IDialogFunctionComponent<T = {}> extends FunctionComponent<T> {
  index: number;
}

export enum DialogSize {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xl2 = 'xl2',
  xl3 = 'xl3',
  xl4 = 'xl4',
  xl5 = 'xl5',
  xl6 = 'xl6',
  xl7 = 'xl7',
  full = 'full',
}

export const dialogSizeMap: Record<DialogSize, string> = {
  [DialogSize.xs]: 'tw-w-full sm:tw-max-w-xs',
  [DialogSize.sm]: 'tw-w-full sm:tw-max-w-sm',
  [DialogSize.md]: 'tw-w-full sm:tw-max-w-md',
  [DialogSize.lg]: 'tw-max-w-lg',
  [DialogSize.xl]: 'tw-max-w-xl',
  [DialogSize.xl2]: 'tw-max-w-2xl',
  [DialogSize.xl3]: 'tw-max-w-3xl',
  [DialogSize.xl4]: 'tw-max-w-4xl',
  [DialogSize.xl5]: 'tw-max-w-5xl',
  [DialogSize.xl6]: 'tw-max-w-6xl',
  [DialogSize.xl7]: 'tw-max-w-7xl',
  [DialogSize.full]: 'tw-w-full',
};
