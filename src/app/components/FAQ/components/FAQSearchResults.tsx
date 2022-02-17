import React from 'react';
import { IItems } from './FAQCategory';

import arrowRight from 'assets/images/arrow-right.svg';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface IFAQSearchResultsProps {
  keyword: string;
  list: {
    category: string;
    items: IItems[];
  }[];
  selectQuestion: (categoryIndex: number, questionIndex: number) => void;
}

export const FAQSearchResults: React.FC<IFAQSearchResultsProps> = ({
  keyword,
  list,
  selectQuestion,
}) => {
  return (
    <>
      <p>Search results for: {keyword}</p>
      <ul className="tw-flex tw-flex-col">
        {list.map(({ items }, categoryIndex) =>
          items.map(({ question, answer }, questionIndex) => {
            if ((question + answer).includes(keyword))
              return (
                <li
                  onClick={() => selectQuestion(categoryIndex, questionIndex)}
                  className="tw-cursor-pointer tw-p-4 tw-border tw-border-white tw-rounded tw-my-2 tw-relative"
                >
                  <img
                    src={arrowRight}
                    className="tw-absolute tw-top-2.5 tw-right-2.5"
                    alt="->"
                  />
                  <h6 className="tw-mb-2">{question}</h6>

                  <p className="tw-max-h-40 tw-mb-0 tw-overflow-hidden tw-w-full tw-line-clamp-3">
                    <ReactMarkdown
                      children={answer}
                      rehypePlugins={[rehypeRaw]}
                    />
                  </p>
                </li>
              );
            return null;
          }),
        )}
      </ul>
    </>
  );
};
