import React from 'react';
import { Spinner as BPSpinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner';
import classNames from 'classnames';

interface Props {
  className?: string;
  innerClassName?: string;
}

export const Spinner: React.FC<Props> = ({ className, innerClassName }) => {
  return (
    <div
      className={classNames(
        'tw-flex tw-flex-row tw-items-center tw-justify-center',
        className,
      )}
    >
      <span
        className={classNames(
          'tw-w-min tw-btn-loader__spinner tw-flex tw-flex-row tw-items-center active',
          innerClassName,
        )}
      >
        <BPSpinner size={40} className="tw-fill-current" />
      </span>
    </div>
  );
};
