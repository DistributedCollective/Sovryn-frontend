import classNames from 'classnames';
import React from 'react';

interface IItems {
  question: string;
  answer: string;
}

interface IFAQCategoryProps {
  category: string;
  items: IItems[];
  selectCategory: () => void;
  active: boolean;
}

export const FAQCategory: React.FC<IFAQCategoryProps> = ({
  category,
  items,
  selectCategory,
  active,
}) => {
  return (
    <div
      onClick={selectCategory}
      className={classNames('tw-cursor-pointer', {
        'tw-opacity-75': !active,
      })}
    >
      {category}
    </div>
  );
};
