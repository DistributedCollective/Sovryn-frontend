import React from 'react';
import styles from './index.module.scss';
import cn from 'classnames';

interface IStarButton {
  active: boolean;
  className?: string;
  onClick: () => void;
}

export const StarButton: React.FC<IStarButton> = ({
  active,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'tw-cursor-pointer tw-transition hover:tw-opacity-75',
        styles.star,
        { active },
        className,
      )}
      onClick={onClick}
    >
      <svg
        className="tw-w-5 tw-h-5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    </div>
  );
};
