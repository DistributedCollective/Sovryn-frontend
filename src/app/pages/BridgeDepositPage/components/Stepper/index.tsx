import React from 'react';
import { Step } from './Step';
import { useMaintenance } from 'app/hooks/useMaintenance';

export interface StepItem {
  stepTitle: string;
  value: number;
  title?: string;
  icon?: React.ReactChild;
}

type Props = {
  onClick: Function;
  step: number;
  steps: StepItem[];
};

export function Stepper({ steps, step, onClick }: Props) {
  const { checkMaintenances, States } = useMaintenance();
  const { [States.BRIDGE]: bridgeLocked } = checkMaintenances();
  const activeIndex = steps.findIndex(item => item.value === step);
  return (
    <div>
      <ul className="tw-relative">
        <div className="tw-relative tw-flex">
          <div
            className="tw-h-full tw-absolute tw-transition-transform tw-duration-700 tw-ease-in-out tw-flex tw-items-center"
            style={{
              transform: `translateY(${100 * activeIndex}%)`,
            }}
          >
            <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-mr-4 tw-border-sov-white"></span>
          </div>
          <Step
            step={steps[0]}
            current={activeIndex === 0}
            active={activeIndex >= 0 && !bridgeLocked}
            onClick={() => onClick(steps[0].value)}
            disabled={bridgeLocked}
            isFirst
          />
        </div>

        {steps.slice(1).map((item, i) => (
          <Step
            key={i}
            step={item}
            current={activeIndex === i + 1}
            active={activeIndex >= i + 1 && !bridgeLocked}
            onClick={() => !bridgeLocked && onClick(item.value)}
            disabled={bridgeLocked}
          />
        ))}
      </ul>
    </div>
  );
}
