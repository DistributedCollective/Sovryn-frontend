import React from 'react';
import { Slider as BPSlider } from '@blueprintjs/core';
import classNames from 'classnames';
import styles from './index.module.css';

type LabelRendererFn = (value: number, opts?) => string | JSX.Element;

interface Props {
  value: number;
  onChange?: (value: number) => void;
  onRelease?: (value: number) => void;
  min?: number;
  max?: number;
  stepSize?: number;
  labelRenderer?: boolean | LabelRendererFn;
  className?: string;
}

export function Slider({ className, ...props }: Props) {
  return (
    <BPSlider {...props} className={classNames(styles.slider, className)} />
  );
}
