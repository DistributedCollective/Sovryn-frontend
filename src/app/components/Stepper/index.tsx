import React from 'react';
import { Step } from './Step';

export interface StepItem {
  stepTitle: string;
  value: number;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

type IStepperProps = {
  onClick: Function;
  step: number;
  steps: StepItem[];
  locked?: boolean;
};

export const Stepper: React.FC<IStepperProps> = ({
  steps,
  step,
  onClick,
  locked,
}) => {
  const activeIndex = steps.findIndex(item => item.value === step) + 1;
  return (
    <div>
      <div className="tw-bg-gray-4 tw-h-1.5 tw-w-full tw-relative tw-rounded-3xl tw-overflow-hidden">
        <div
          className="tw-bg-primary tw-h-1.5 tw-absolute tw-left-0 tw-rounded-3xl"
          style={{
            width: `${
              (activeIndex * 100) / steps.length -
              (activeIndex !== steps.length ? 10 : 0)
            }%`,
          }}
        ></div>
      </div>
      <ul className="tw-relative tw-flex tw-items-center tw-justify-between tw-gap-8 tw-mt-5">
        {steps.map((item, i) => (
          <Step
            key={i}
            step={item}
            current={activeIndex === i}
            active={activeIndex >= i && !locked}
            onClick={() => !locked && onClick(item.value)}
            disabled={locked}
          />
        ))}
      </ul>
    </div>
  );
};
