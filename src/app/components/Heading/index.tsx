import classNames from 'classnames';
import React from 'react';
import styles from './index.module.scss';

export enum HeadingStyles {
  'h1' = 'h1',
  'h2' = 'h2',
  'h3' = 'h3',
  'h4' = 'h4',
  'h5' = 'h5',
  'h6' = 'h6',
  'label' = 'label',
}

type IHeadingProps = {
  style?: HeadingStyles;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const Heading: (tag: string) => React.FC<IHeadingProps> = tag => ({
  style,
  className,
  id,
  children,
}) => {
  return React.createElement(
    tag,
    {
      className: classNames(
        style ? styles[style.toString()] : styles[tag],
        className,
      ),
      id,
    },
    children,
  );
};

export const H1 = Heading('h1');
export const H2 = Heading('h2');
export const H3 = Heading('h3');
export const H4 = Heading('h4');
export const H5 = Heading('h5');
export const H6 = Heading('h6');
export const Label = Heading('label');
