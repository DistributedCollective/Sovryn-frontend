import React from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Card(props: Props) {
  return (
    <div
      className={classNames(
        'tw-bg-black tw-border-1 tw-border-gray-6 tw-rounded-xl tw-py-6 tw-px-8 tw-w-full',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
