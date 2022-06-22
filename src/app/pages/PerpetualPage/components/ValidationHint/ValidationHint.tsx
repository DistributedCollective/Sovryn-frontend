import React from 'react';
import { Validation } from '../../utils/contractUtils';
import classNames from 'classnames';

type ValidationHintProps = {
  validation?: Validation;
  className?: string;
};

export const ValidationHint: React.FC<ValidationHintProps> = ({
  validation,
  className,
}) => {
  if (!validation || validation.valid || validation.errors.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-col tw-justify-between tw-px-6 tw-py-1 tw-text-warning tw-text-xs tw-font-medium tw-border tw-border-warning tw-rounded-lg',
        className,
      )}
    >
      {validation.errorMessages}
    </div>
  );
};
