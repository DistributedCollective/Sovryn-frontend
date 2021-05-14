import React from 'react';

interface ITopInfoContent {
  content: string;
  isApproximation?: boolean;
}

export const TopInfoContent: React.FC<ITopInfoContent> = ({
  content,
  isApproximation = false,
}: ITopInfoContent) => (
  <div className="tw-text-2xl tw-font-medium tw-tracking-normal tw-pt-1">
    {isApproximation && '≈'} {content}
  </div>
);
