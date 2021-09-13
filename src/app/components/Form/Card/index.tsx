import React from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Card(props: Props) {
  return (
    <div
      className={cn(
        'tw-bg-black tw-border-1 tw-border-gray-6 tw-rounded-xl tw-py-6 tw-px-8 tw-w-full',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
