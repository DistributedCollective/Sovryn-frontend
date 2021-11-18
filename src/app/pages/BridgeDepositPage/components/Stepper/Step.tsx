import React from 'react';
import classNames from 'classnames';

import { StepItem } from './index';

interface IStepProps {
  step: StepItem;
  current?: Boolean;
  active?: Boolean;
  isFirst?: Boolean;
  onClick: Function;
  disabled?: boolean;
}

export const Step: React.FC<IStepProps> = ({
  step,
  current,
  active,
  isFirst,
  onClick,
  disabled,
}) => {
  return (
    <li
      className={classNames(
        'tw-flex tw-items-center tw-transition tw-duration-700 tw-ease-in-out',
        {
          'tw-opacity-25': !active,
          'tw-font-bold': current,
        },
        disabled ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer',
      )}
      style={{ height: 64 }}
      onClick={() => !disabled && onClick()}
    >
      <div style={{ width: 36 }}>
        <span className="tw-flex tw-items-center tw-justify-center tw-w-5 tw-h-5 tw-border tw-rounded-full tw-transform tw-relative tw-border-transparent">
          {!isFirst && (
            <span
              className="tw-h-8 tw-bg-white tw-absolute tw--top-1.5 tw-left-0 tw-right-0 tw-mx-auto tw-transform tw--translate-y-full tw--translate-x-1/2"
              style={{ width: 1 }}
            ></span>
          )}
          <span
            className={classNames(
              'tw-absolute tw-border-sov-white tw-rounded-full tw-inline-block tw-transition tw-duration-700 tw-ease-in-out',
              {
                'tw-w-2 tw-h-2': !active,
                'tw-w-2.5 tw-h-2.5': !!active,
                'tw-scale-0': step?.icon,
                'tw-scale-100': !step?.icon,
                'tw-bg-sov-white': !step?.icon,
              },
            )}
          ></span>
          <span
            className={classNames(
              'tw-absolute tw-border-sov-white tw-w-2 tw-h-2 tw-rounded-full tw-inline-block tw-transition tw-duration-700 tw-ease-in-out',
              {
                'tw-transform tw-scale-125': !!active,
                'tw-scale-0': step?.icon,
                'tw-scale-100': !step?.icon,
                'tw-bg-sov-white': !step?.icon,
              },
            )}
          ></span>
          <span
            className={classNames(
              'tw-absolute tw-flex tw-items-center tw-justify-center tw-transform tw-border-sov-white tw-w-4 tw-h-4 tw-rounded-full tw-transition tw-duration-700 tw-ease-in-out',
              {
                'tw-scale-0': !step?.icon,
                'tw-scale-125': step?.icon,
              },
            )}
          >
            {step?.icon}
          </span>
        </span>
      </div>

      {step?.title || step.stepTitle}
    </li>
  );
};
