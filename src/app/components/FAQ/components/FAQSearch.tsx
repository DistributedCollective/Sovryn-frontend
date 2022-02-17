import React from 'react';
import searchIcon from 'assets/images/search.svg';
import closeIcon from 'assets/images/close.svg';

interface FAQSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const FAQSearch: React.FC<FAQSearchProps> = ({ value, onChange }) => {
  return (
    <div className="tw-flex tw-items-center tw-relative">
      <input
        value={value}
        placeholder="Search"
        onChange={({ currentTarget: { value } }) => onChange(value)}
        className="tw-w-80 tw-border-b tw-border-white tw-bg-transparent tw-px-6 tw-py-2"
      />
      <img className="tw-absolute tw-left-1" src={searchIcon} alt="search" />
      {value && (
        <img
          className="tw-absolute tw-right-1 tw-cursor-pointer"
          onClick={() => onChange('')}
          src={closeIcon}
          alt="remove"
        />
      )}
    </div>
  );
};
