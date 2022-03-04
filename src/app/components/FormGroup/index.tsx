import classNames from 'classnames';
import { Tooltip } from '@blueprintjs/core';
import React from 'react';

type FormGroupProps = {
  children: React.ReactNode;
  label?: React.ReactNode;
  labelFor?: string;
  subLabel?: React.ReactNode;
  helperText?: React.ReactNode;
  labelInfo?: React.ReactNode;
  tooltipText?: React.ReactNode;
  inline?: boolean;
  disabled?: boolean;
  className?: string;
};

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  label,
  labelFor,
  subLabel,
  helperText,
  labelInfo,
  tooltipText,
  inline,
  disabled,
  className,
}) => {
  return (
    <div
      className={classNames(
        'tw-mb-4 tw-flex',
        {
          'tw-flex-col': !inline,
          'tw-flex-row': inline,
          'tw-opacity-50': disabled,
        },
        className,
      )}
    >
      {label && (
        <div className="tw-flex">
          <label
            htmlFor={labelFor}
            className="tw-block tw-mb-1.5 tw-text-sov-white"
          >
            {label}
            {labelInfo && (
              <span className="tw-ml-1.5 tw-font-light">{labelInfo}</span>
            )}
          </label>
          {tooltipText && (
            <Tooltip
              className={classNames('tw-ml-1.5 tw-leading-none', {
                'tw-mr-2.5': inline,
              })}
              content={<>{tooltipText}</>}
            >
              <div className="tw-flex tw-items-center tw-justify-center tw-bg-sov-white tw-text-black tw-w-3.5 tw-h-3.5 tw-rounded-full">
                <span className="tw-text-tiny">i</span>
              </div>
            </Tooltip>
          )}
        </div>
      )}
      {subLabel && (
        <div
          className={classNames(
            'tw-mb-4 tw-text-gray-8 tw-font-light tw-text-xs',
            {
              'tw-mr-1.5': inline,
            },
          )}
        >
          {subLabel}
        </div>
      )}
      <div>
        {children}
        {helperText && (
          <div className="tw-mt-4 tw-text-primary tw-font-light tw-text-xs">
            {helperText}
          </div>
        )}
      </div>
    </div>
  );
};
