import React from 'react';
import { Slider } from 'app/components/Form/Slider';
import styles from './index.module.scss';

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
      onChange={value => onChange(value)}
      min={2}
      max={5}
      stepSize={1}
      labelRenderer={value => <>{value}x</>}
      className={styles.colorized}
      dataActionId="margin-position-leverage-bar"
    />
  );
};
