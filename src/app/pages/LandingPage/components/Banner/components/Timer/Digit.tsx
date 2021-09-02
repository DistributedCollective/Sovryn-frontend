import React from 'react';

interface IDigitProps {
  value: number;
  title: string;
}

export const Digit: React.FC<IDigitProps> = ({ value, title }) => {
  const leftDigit = value >= 10 ? value.toString()[0] : '0';
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString();

  return (
    <div className="tw-flex tw-flex-col tw-relative">
      <span className="tw-px-2">
        {leftDigit}
        {rightDigit}
      </span>

      <span className="tw-absolute tw--bottom-3 tw-w-full tw-text-tiny tw-text-center">
        {title}
      </span>
    </div>
  );
};
