import classNames from 'classnames';
import React from 'react';

type IDataCardProps = {
  title: string;
  className?: String;
  children: React.ReactNode;
};

export const DataCard: React.FC<IDataCardProps> = ({
  title,
  className,
  children,
}) => (
  <div
    className={classNames(
      'tw-flex tw-flex-col tw-flex-1 tw-min-w-min tw-px-4 tw-pt-1.5 tw-pb-4 tw-bg-black tw-rounded-xl',
      className,
    )}
  >
    <h2 className="tw-px-4 tw-py-1 tw-mb-4 tw-text-sm tw-font-medium tw-border-b tw-border-sov-white">
      {title}
    </h2>
    {children}
  </div>
);
