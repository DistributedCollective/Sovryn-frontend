import React from 'react';
import { Slider } from 'app/components/Form/Slider';
import cn from 'classnames';
import styles from './index.module.scss';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function LeverageSelector(props: Props) {
  return (
    <Slider
      value={props.value}
      onChange={value => props.onChange(value)}
      min={2}
      max={5}
      stepSize={1}
      labelRenderer={value => <>{value}x</>}
      className={cn(styles.colorized)}
      dataActionId="margin-leverageSelector"
    />
  );
}
