import React from 'react';
import { Slider } from 'app/components/Form/Slider';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function SlippageSelector(props: Props) {
  return (
    <Slider
      value={props.value}
      onChange={value => props.onChange(value)}
      min={0.1}
      max={1.0}
      stepSize={4}
      labelRenderer={value => <>{value}%</>}
    />
  );
}
