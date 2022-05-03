import React from 'react';
import { Slider } from 'app/components/Form/Slider';
import styles from './index.module.scss';
import { sliderMarginLeverageValues } from 'app/components/Form/Slider/sliderDefaultLabelValues';

interface ILeverageSelectorProps {
  value: number;
  onChange: (value: number) => void;
}
export const LeverageSelector: React.FC<ILeverageSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <Slider
      value={value}
      onChange={onChange}
      min={sliderMarginLeverageValues.min}
      max={sliderMarginLeverageValues.max}
      stepSize={sliderMarginLeverageValues.stepSize}
      labelRenderer={value => <>{value}x</>}
      className={styles.colorized}
      dataActionId="margin-position-leverage-bar"
    />
  );
};
