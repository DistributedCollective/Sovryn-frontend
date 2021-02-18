import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { makeId } from '../../../../utils/helpers';

interface FormGroupProps {
  label?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ children, className, ...props }: FormGroupProps) {
  const [id, setId] = useState<string>(props.id || makeId());

  useEffect(() => {
    setId(prevState => props.id || prevState || makeId());
  }, [props.id]);

  return (
    <div className={cn('tw-mb-4', className)}>
      {props.label && (
        <label htmlFor={id} className="tw-block tw-mb-2 tw-text-white">
          {props.label}
        </label>
      )}
      <PassPropsToChildren id={id}>{children}</PassPropsToChildren>
      {props.error && (
        <div className="tw-text-red tw-mt-2 tw-text-xs tw-font-light">
          {props.error}
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

  return <div>{childrenWithProps}</div>;
}
