import React from 'react';
import { Step } from './Step';

export type StepItem = {
  stepTitle: React.ReactNode;
  value: number;
  title?: React.ReactNode;
  icon?: React.ReactNode;
};

type StepperProps = {
  onClick: Function;
  step: number;
  steps: StepItem[];
  locked?: boolean;
};

export const Stepper: React.FC<StepperProps> = ({
  steps,
  step,
  onClick,
  locked,
}) => {
  const activeIndex = steps.findIndex(item => item.value === step) + 1;
  return (
    <ul className="tw-relative tw-flex tw-items-start tw-justify-between">
      {steps.map((item, i) => (
        <Step
          key={item.value}
          step={item}
          current={activeIndex - 1 === i}
          active={activeIndex - 1 >= i && !locked}
          onClick={() => !locked && onClick(item.value)}
          disabled={locked}
        />
      ))}
    </ul>
  );
};
