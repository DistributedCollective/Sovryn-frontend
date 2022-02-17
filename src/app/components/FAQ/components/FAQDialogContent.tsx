import React, { useEffect, useMemo, useRef, useState } from 'react';
import questions from '../questions';
import { FAQCategory } from './FAQCategory';
import debounce from 'lodash.debounce';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FAQSearchResults } from './FAQSearchResults';
import { FAQSearch } from './FAQSearch';

export const FAQDialogContent: React.FC = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');

  const setKeywordDebounced = useRef(debounce(setKeyword, 300));

  const list = questions.marginTrade;

  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [activeCategoryIndex]);

  const activeCategory = useMemo(() => {
    return list[activeCategoryIndex];
  }, [activeCategoryIndex, list]);

  const activeQuestion = useMemo(() => {
    return activeCategory.items[activeQuestionIndex];
  }, [activeCategory, activeQuestionIndex]);

  const handleChange = value => {
    setSearch(value);
    setKeywordDebounced.current(value);
  };

  return (
    <>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-12">
        <FAQTitle />
        <FAQSearch value={search} onChange={handleChange} />
      </div>
      <div className="tw-flex" style={{ height: 400 }}>
        <div className="tw-w-1/3">
          {list.map((item, index) => (
            <FAQCategory
              key={item.category}
              category={item.category}
              items={item.items}
              selectCategory={() => setActiveCategoryIndex(index)}
              selectQuestion={index => {
                setActiveQuestionIndex(index);
                setSearch('');
                setKeyword('');
              }}
              active={index === activeCategoryIndex}
              activeQuestionIndex={activeQuestionIndex}
            />
          ))}
        </div>
        <div className="tw-w-2/3 tw-overflow-auto tw-border-sov-white tw-border-opacity-40 tw-border-l tw-border-r tw-px-8">
          {keyword.length < 3 && (
            <ReactMarkdown
              children={activeQuestion.answer}
              rehypePlugins={[rehypeRaw]}
            />
          )}

          {keyword.length > 2 && (
            <FAQSearchResults
              selectQuestion={(categoryIndex, questionIndex) => {
                setActiveCategoryIndex(categoryIndex);
                setActiveQuestionIndex(questionIndex);
                setSearch('');
                setKeyword('');
              }}
              keyword={keyword}
              list={list}
            />
          )}
        </div>
      </div>
      <p className="tw-absolute tw-right-10 tw-bottom-2 tw-text-tiny">
        For an in-depth information please visit our{' '}
        <a
          className="tw-underline"
          href="https://wiki.sovryn.app/en/sovryn-dapp/faq-dapp"
          target="_blank"
          rel="noreferrer noopener"
        >
          wiki
        </a>
      </p>
    </>
  );
};

const FAQTitle: React.FC = () => {
  return (
    <h5 className="tw-text-4xl tw-text-white">
      FAQ <span className="tw-text-xl tw-ml-4">Margin Trade</span>
    </h5>
  );
};
