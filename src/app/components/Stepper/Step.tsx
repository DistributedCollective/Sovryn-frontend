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
    <li
      className={classNames(
        'tw-flex tw-items-center tw-transition tw-duration-700 tw-ease-in-out tw-text-xs',
        {
          'tw-opacity-30': !active,
          'tw-font-semibold': active || current,
        },
        disabled ? 'tw-cursor-not-allowed' : 'tw-cursor-pointer',
      )}
      onClick={() => !disabled && onClick()}
    >
      {step.stepTitle}
    </li>
  );
};
