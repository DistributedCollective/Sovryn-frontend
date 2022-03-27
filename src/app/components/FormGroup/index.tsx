import classNames from 'classnames';
import { Tooltip } from '@blueprintjs/core';
import React from 'react';
import infoIcon from 'assets/images/info_icon.svg';

type FormGroupProps = {
  children: React.ReactNode;
  label: React.ReactNode;
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
        },
        className,
      )}
    >
      <div
        className={classNames('tw-flex', {
          'tw-opacity-50': disabled,
        })}
      >
        <label
          htmlFor={labelFor}
          className="tw-block tw-mb-1.5 tw-text-sov-white tw-font-medium"
        >
          {label}
          {labelInfo && (
            <span className="tw-ml-1.5 tw-font-normal">{labelInfo}</span>
          )}
        </label>
        {tooltipText && (
          <Tooltip
            className={classNames('tw-ml-1.5 tw-leading-none', {
              'tw-mr-2.5': inline,
            })}
            content={<>{tooltipText}</>}
          >
            <img src={infoIcon} alt="info" />
          </Tooltip>
        )}
      </div>

      {subLabel && (
        <div
          className={classNames('tw-mb-4 tw-text-gray-8 tw-text-xs', {
            'tw-mr-1.5': inline,
            'tw-opacity-50': disabled,
          })}
        >
          {subLabel}
        </div>
      )}
      <div>
        {children}
        {helperText && (
          <div
            className={classNames('tw-mt-4 tw-text-primary tw-text-xs', {
              'tw-opacity-50': disabled,
            })}
          >
            {helperText}
          </div>
        )}
      </div>
    </div>
  );
};
