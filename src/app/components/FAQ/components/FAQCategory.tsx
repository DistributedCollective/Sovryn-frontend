import classNames from 'classnames';
import React from 'react';
import { Transition } from 'react-transition-group';

import plusIcon from 'assets/images/plus.svg';
import minusIconCicle from 'assets/images/minus.svg';
import minusIcon from 'assets/images/minusIcon.svg';
export interface IItems {
  question: string;
  answer: string;
}

interface IFAQCategoryProps {
  category: string;
  items: IItems[];
  selectCategory: () => void;
  selectQuestion: (index: number) => void;
  active: boolean;
  activeQuestionIndex: number;
}

const duration = 300;

export const FAQCategory: React.FC<IFAQCategoryProps> = ({
  category,
  items,
  selectCategory,
  selectQuestion,
  active,
  activeQuestionIndex,
}) => {
  return (
    <div
      onClick={selectCategory}
      className={classNames('tw-cursor-pointer tw-my-3', {
        'tw-opacity-75': !active,
      })}
    >
      <span className="tw-flex tw-items-center">
        <img
          className="tw-mr-2 tw-w-5"
          src={active ? plusIcon : minusIconCicle}
          alt={active ? '+' : '-'}
        />

        {category}
      </span>
      <ul
        className={classNames('tw-pl-3 panel-collapse', {
          'panel-close': !active,
        })}
      >
        {items.map((item, index) => (
          <Transition key={index} in={active} timeout={duration}>
            {state => (
              <li
                className={classNames(
                  'tw-my-3 tw-cursor-pointer tw-transition-transform tw-transform tw-duration-500 tw-flex tw-items-center',
                  {
                    'tw-opacity-75 tw-translate-x-0':
                      activeQuestionIndex !== index || state === 'exited',
                    'tw-translate-x-6':
                      activeQuestionIndex === index && state !== 'exited',
                  },
                )}
                onClick={() => selectQuestion(index)}
              >
                <img
                  className={classNames(
                    'tw-mr-2 tw-w-3 tw-transition-transform tw-transform tw-duration-500',
                    {
                      'tw-scale-0':
                        activeQuestionIndex !== index || state === 'exited',
                      'tw-scale-100':
                        activeQuestionIndex === index && state !== 'exited',
                    },
                  )}
                  src={minusIcon}
                  alt="-"
                />
                {item.question}
              </li>
            )}
          </Transition>
        ))}
      </ul>
    </div>
  );
};
