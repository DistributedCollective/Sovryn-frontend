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
  const isCompleted = activeIndex === steps.length;
  return (
    <div>
      <div className="tw-bg-gray-4 tw-h-1.5 tw-w-full tw-relative tw-rounded-3xl tw-overflow-hidden">
        <div
          className="tw-bg-primary tw-h-1.5 tw-absolute tw-left-0 tw-rounded-3xl"
          style={{
            width: isCompleted
              ? '100%'
              : `calc(${((activeIndex - 1) * 100) / steps.length}% + 30px)`,
          }}
        ></div>
      </div>
      <ul className="tw-relative tw-flex tw-items-start tw-justify-between tw-mt-5">
        {steps.map((item, i) => (
          <Step
            key={i}
            step={item}
            current={activeIndex - 1 === i}
            active={activeIndex - 1 >= i && !locked}
            onClick={() => !locked && onClick(item.value)}
            disabled={locked}
          />
        ))}
      </ul>
    </div>
  );
};
