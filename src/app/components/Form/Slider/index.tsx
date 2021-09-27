import React from 'react';
import { Slider as BPSlider } from '@blueprintjs/core/lib/esm/components/slider/slider';
import cn from 'classnames';
import styles from './index.module.scss';

type LabelRendererFn = (value: number, opts?) => string | JSX.Element;

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
}

export function Slider({ className, ...props }: Props) {
  return (
    <div
      className={cn(styles.host, className)}
      data-action-id={props.dataActionId}
    >
      <BPSlider {...props} />
    </div>
  );
}
