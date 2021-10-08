import React, { useCallback, useMemo } from 'react';
import { Slider, SliderType } from 'app/components/Form/Slider';

interface ILeverageSelectorProps {
  value: number;
  steps: number[];
  onChange: (value: number) => void;
}

export const LeverageSelector: React.FC<ILeverageSelectorProps> = ({
  value,
  steps,
  onChange,
}) => {
  const sliderValue = useMemo(() => steps.indexOf(value), [value, steps]);
  const onChangeWrapped = useCallback(value => onChange(steps[value]), [
    steps,
    onChange,
  ]);

  return (
    <Slider
      value={sliderValue}
      onChange={onChangeWrapped}
      min={0}
      max={steps.length - 1}
      stepSize={1}
      labelRenderer={value => `${steps[value]}x`}
      type={SliderType.gradient}
    />
  );
};
