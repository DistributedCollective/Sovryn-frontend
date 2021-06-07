import React from 'react';
import cn from 'classnames';

type Props = {
  onClick: Function;
  step: number;
  steps: StepItem[];
};
export function Stepper({ steps, step, onClick }: Props) {
  return (
    <div>
      <ul className="tw-relative">
        <div className="tw-relative tw-flex">
          <div
            className="lg:tw-mt-0.5 tw-h-full tw-absolute tw-transition-transform tw-duration-200 tw-ease-in-out"
            style={{
              transform: `translateY(${100 * (step - 1)}%)`,
            }}
          >
            <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-mr-4 tw-border-white"></span>
          </div>
          <Step
            title={steps[0].title}
            value={steps[0].value}
            current={step === 1}
            active={step >= 1}
            onClick={() => onClick(1)}
            isFirst
          />
        </div>

        {steps.slice(1).map((item, i) => (
          <Step
            key={i}
            title={item.title}
            value={item.value}
            active={step >= i + 2}
            current={step === i + 2}
            onClick={() => onClick(i + 2)}
          />
        ))}
      </ul>
    </div>
  );
}

export interface StepValue {
  title: string;
  icon?: React.ReactChild;
}
export interface StepItem {
  title: string;
  value?: StepValue | null;
}

interface StepProps {
  title: string;
  current?: Boolean;
  value?: StepValue | null;
  active?: Boolean;
  isFirst?: Boolean;
  onClick: Function;
}

function Step({ title, current, value, active, isFirst, onClick }: StepProps) {
  return (
    <li
      className={cn(
        'tw-flex tw-items-center tw-mb-11 tw-cursor-pointer tw-transition tw-duration-200 tw-ease-in-out',
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
            'tw-absolute tw-border-white tw-w-2 tw-h-2 tw-rounded-full tw-bg-white tw-inline-block tw-transition tw-duration-200 tw-ease-in-out',
            {
              'tw-transform tw-scale-125': !!active,
              'tw-scale-0': value?.icon,
              'tw-scale-100': !value?.icon,
            },
          )}
        ></span>

        <span
          className={cn(
            'tw-absolute tw-flex tw-items-center tw-justify-center tw-transform tw-border-white tw-w-3.5 tw-h-3.5 tw-rounded-full tw-transition tw-duration-200 tw-ease-in-out',
            {
              'tw-scale-0': !value?.icon,
              'tw-scale-125': value?.icon,
            },
          )}
        >
          {value?.icon}
        </span>
      </span>
      {value?.title || title}
    </li>
  );
}
