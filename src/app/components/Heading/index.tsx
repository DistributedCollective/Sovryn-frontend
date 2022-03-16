import classNames from 'classnames';
import React from 'react';
import styles from './index.module.scss';

export enum HeadingStyle {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
  label = 'label',
}

type HeadingProps = {
  style?: HeadingStyle;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const Heading: (tag: HeadingStyle) => React.FC<HeadingProps> = tag => ({
  style,
  className,
  id,
  children,
}) =>
  React.createElement(
    tag,
    {
      className: classNames(style ? styles[style] : styles[tag], className),
      id,
    },
    children,
  );

export const H1 = Heading(HeadingStyle.h1);
export const H2 = Heading(HeadingStyle.h2);
export const H3 = Heading(HeadingStyle.h3);
export const H4 = Heading(HeadingStyle.h4);
export const H5 = Heading(HeadingStyle.h5);
export const H6 = Heading(HeadingStyle.h6);
export const Label = Heading(HeadingStyle.label);
