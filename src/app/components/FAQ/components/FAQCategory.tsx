import classNames from 'classnames';
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
      <span>{category}</span>
      <TransitionGroup component="ul">
        {active &&
          items.map((item, i) => (
            <CSSTransition
              in={active}
              timeout={300}
              key={i}
              unmountOnExit
              classNames="item"
            >
              <li>{item.question}</li>
            </CSSTransition>
          ))}
      </TransitionGroup>
    </div>
  );
};
