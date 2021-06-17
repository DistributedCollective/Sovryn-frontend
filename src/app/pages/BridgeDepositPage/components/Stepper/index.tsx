import React from 'react';
import cn from 'classnames';

type Props = {
  onClick: Function;
  step: number;
  steps: StepItem[];
};
export function Stepper({ steps, step, onClick }: Props) {
  const activeIndex = steps.findIndex(item => item.value === step);
  return (
    <div>
      <ul className="tw-relative">
        <div className="tw-relative tw-flex">
          <div
            className="lg:tw-mt-0.5 tw-h-full tw-absolute tw-transition-transform tw-duration-700 tw-ease-in-out"
            style={{
              transform: `translateY(${100 * activeIndex}%)`,
            }}
          >
            <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-mr-4 tw-border-white"></span>
          </div>
          <Step
            step={steps[0]}
            current={activeIndex === 0}
            active={activeIndex >= 0}
            onClick={() => onClick(steps[0].value)}
            isFirst
          />
        </div>

        {steps.slice(1).map((item, i) => (
          <Step
            key={i}
            step={item}
            current={activeIndex === i + 1}
            active={activeIndex >= i + 1}
            onClick={() => onClick(item.value)}
          />
        ))}
      </ul>
    </div>
  );
}

export interface StepItem {
  stepTitle: string;
  value: number;
  title?: string;
  icon?: React.ReactChild;
}

interface StepProps {
  step: StepItem;
  current?: Boolean;
  active?: Boolean;
  isFirst?: Boolean;
  onClick: Function;
}

function Step({ step, current, active, isFirst, onClick }: StepProps) {
  return (
    <li
      className={cn(
        'tw-flex tw-items-center tw-mb-11 tw-cursor-pointer tw-transition tw-duration-700 tw-ease-in-out',
        {
          'tw-opacity-25': !active,
          'tw-font-bold': current,
        },
      )}
      onClick={() => onClick()}
    >
      <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-transform tw-relative tw-mr-4 tw-border-transparent">
        {!isFirst && (
          <span
            className="tw-h-9 bg-white tw-absolute tw--top-1.5 tw-left-0 tw-right-0 tw-mx-auto tw-transform tw--translate-y-full tw--translate-x-1/2"
            style={{ width: 1 }}
          ></span>
        )}
        <span
          className={cn(
            'tw-absolute tw-border-white tw-w-2 tw-h-2 tw-rounded-full tw-bg-white tw-inline-block tw-transition tw-duration-700 tw-ease-in-out',
            {
              'tw-transform tw-scale-125': !!active,
              'tw-scale-0': step?.icon,
              'tw-scale-100': !step?.icon,
            },
          )}
        ></span>

        <span
          className={cn(
            'tw-absolute tw-flex tw-items-center tw-justify-center tw-transform tw-border-white tw-w-4 tw-h-4 tw-rounded-full tw-transition tw-duration-700 tw-ease-in-out',
            {
              'tw-scale-0': !step?.icon,
              'tw-scale-125': step?.icon,
            },
          )}
        >
          {step?.icon}
        </span>
      </span>
      {step?.title || step.stepTitle}
    </li>
  );
}
