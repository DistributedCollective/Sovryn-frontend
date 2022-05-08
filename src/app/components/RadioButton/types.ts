import { ReactNode } from 'react';

export type RadioEntriesList = {
  value: any;
  text: ReactNode;
  dataActionId?: string;
  disabled?: boolean;
  color?: string;
};

/** The minimum is 2 entries */
export type MinimumTwoEntries = [
  RadioEntriesList,
  RadioEntriesList,
  ...RadioEntriesList[]
];

export enum RadioButtonSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export enum RadioButtonStyle {
  transparent = 'transparent',
  frosted = 'frosted',
  normal = 'normal',
}

export enum RadioButtonColor {
  tradeLong = 'tradeLong',
  tradeShort = 'tradeShort',
  secondary = 'secondary',
  primary = 'primary',
  success = 'success',
  warning = 'warning',
  gray = 'gray',
}
