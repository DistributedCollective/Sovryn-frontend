import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { makeId } from 'utils/helpers';
import { Tooltip } from '@blueprintjs/core';

interface FormGroupProps {
  label?: React.ReactNode;
  describe?: React.ReactNode;
  describeClassName?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  labelTooltip?: string;
}

export function FormGroup({
  children,
  describe,
  className,
  labelClassName,
  labelTooltip,
  ...props
}: FormGroupProps) {
  const [id, setId] = useState<string>(props.id || makeId());

  useEffect(() => {
    setId(prevState => props.id || prevState || makeId());
  }, [props.id]);

  const label = useMemo(
    () =>
      props.label ? (
        <label
          htmlFor={id}
          className={classNames('tw-form-group-label', labelClassName)}
        >
          {props.label}
        </label>
      ) : (
        <></>
      ),
    [id, labelClassName, props.label],
  );

  return (
    <div className={classNames('tw-form-group', className)}>
      {labelTooltip ? (
        <Tooltip
          position="bottom"
          popoverClassName="tw-max-w-md tw-font-light"
          content={labelTooltip}
        >
          {label}
        </Tooltip>
      ) : (
        <>{label}</>
      )}
      <PassPropsToChildren id={id}>{children}</PassPropsToChildren>
      {describe && (
        <div
          className={classNames(
            'tw-form-group-describe',
            props.describeClassName,
          )}
        >
          {describe}
        </div>
      )}
    </div>
  );
}

function PassPropsToChildren({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const childrenWithProps = React.Children.map(children, child => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { id });
    }
    return child;
  });

  return <div className="tw-form-group-content">{childrenWithProps}</div>;
}
