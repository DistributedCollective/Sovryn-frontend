import React from 'react';
import { Slider as BPSlider } from '@blueprintjs/core/lib/esm/components/slider/slider';
import cn from 'classnames';

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
    <div className={cn('tw-slider', className)}>
      <BPSlider {...props} />
    </div>
  );
}
