import React from 'react';
import { Slider as BPSlider } from '@blueprintjs/core/lib/esm/components/slider/slider';
import cn from 'classnames';
import styles from './index.module.scss';

type LabelRendererFn = (value: number, opts?) => string | JSX.Element;

export enum SliderType {
  primary = 'primary',
  secondary = 'secondary',
  gradient = 'gradient',
}

interface Props {
  value: number;
  onChange?: (value: number) => void;
  onRelease?: (value: number) => void;
  min?: number;
  max?: number;
  stepSize?: number;
  labelStepSize?: number;
  labelRenderer?: boolean | LabelRendererFn;
  className?: string;
  labelValues?: number[];
  dataActionId?: string;
  type?: SliderType;
}

export function Slider({
  className,
  type = SliderType.secondary,
  ...props
}: Props) {
  return (
    <div
      className={cn(styles.host, styles[type], className)}
      data-action-id={props.dataActionId}
    >
      <BPSlider {...props} />
    </div>
  );
}
