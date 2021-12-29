import React from 'react';
import classNames from 'classnames';

interface IErrorBadgeProps {
  content: React.ReactNode;
  className?: string;
}

export const ErrorBadge: React.FC<IErrorBadgeProps> = ({
  content,
  className,
}) => (
  <div
    className={classNames(
      'tw-py-4 tw-my-3 tw-text-xs tw-text-warning',
      className,
    )}
  >
    {content}
  </div>
);
