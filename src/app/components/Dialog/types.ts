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
  [DialogSize.full]: 'tw-w-full',
};
