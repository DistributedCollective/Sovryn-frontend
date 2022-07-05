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
  onClick,
  disabled,
}) => {
  return (
    <li className="tw-flex-1 tw-relative tw-px-2">
      <div
        className={classNames(
          'tw-absolute tw-top-0 tw-h-1.5 tw-w-full tw-relative tw-rounded-3xl tw-overflow-hidden',
          {
            'tw-bg-primary': active,
            'tw-bg-gray-4': !active,
          },
        )}
      ></div>
      <div
        className={classNames(
          'tw-flex tw-flex-1 tw-items-center tw-justify-center tw-transition-colors tw-duration-300 tw-duration-700 tw-ease-in-out tw-text-xs tw-text-center tw-mt-6',
          {
            'tw-opacity-30': !active,
            'tw-font-semibold': active || current,
          },
          disabled ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer',
        )}
        onClick={() => !disabled && onClick()}
      >
        {step.stepTitle}
      </div>
    </li>
  );
};
