import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { makeId } from 'utils/helpers';

interface FormGroupProps {
  label?: React.ReactNode;
  describe?: React.ReactNode;
  describeClassName?: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormGroup({
  children,
  describe,
  className,
  labelClassName,
  ...props
}: FormGroupProps) {
  const [id, setId] = useState<string>(props.id || makeId());

  useEffect(() => {
    setId(prevState => props.id || prevState || makeId());
  }, [props.id]);

  return (
    <div className={classNames('tw-form-group', className)}>
      {props.label && (
        <label
          htmlFor={id}
          className={classNames('tw-form-group-label', labelClassName)}
        >
          {props.label}
        </label>
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
