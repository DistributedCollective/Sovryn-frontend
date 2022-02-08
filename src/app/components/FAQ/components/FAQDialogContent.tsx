import React, { useState } from 'react';
import questions from '../questions.json';
import { FAQCategory } from './FAQCategory';

export const FAQDialogContent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const list = questions.marginTrade;
  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-12">
        <FAQTitle />
        <div className="tw-border tw-border-white tw-px-4 tw-py-2 tw-rounded">
          Search Bar
        </div>
      </div>
      <div className="tw-flex">
        <div className="tw-w-1/3">
          {list.map((item, index) => (
            <FAQCategory
              key={item.category}
              category={item.category}
              items={item.items}
              selectCategory={() => setActiveCategory(index)}
              active={index === activeCategory}
            />
          ))}
        </div>
        <div className="tw-w-2/3">
          <p>Content</p>
        </div>
      </div>
    </div>
  );
};

const FAQTitle: React.FC = () => {
  return (
    <h5 className="tw-text-4xl tw-text-white">
      FAQ <span className="tw-text-xl tw-ml-4">Margin Trade</span>
    </h5>
  );
};
