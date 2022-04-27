import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactNode } from 'react';
import * as IconNames from './iconNames';

export type IconName = typeof IconNames[keyof typeof IconNames];

export enum IconSize {
  STANDARD = 16,
  INLINE = '1em',
  SM = 'sm',
}

export enum ViewBoxSize {
  DEFAULT = '0 0 32 32',
}

export type IconType = IconName | ReactNode | IconProp;
