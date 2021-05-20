import React from 'react';
import { HighlightedBorder, LootDropColors, LootDropWrapper } from './styled';

interface ILootDropProps {
  title: string | JSX.Element;
  pool: string;
  startDate: string;
  endDate: string;
  linkUrl: string;
  linkText: string;
  highlightColor: LootDropColors;
}

export const LootDrop: React.FC<ILootDropProps> = ({
  highlightColor,
  title,
  pool,
  startDate,
  endDate,
  linkUrl,
  linkText,
}) => (
  <LootDropWrapper>
    <div className="tw-p-4 tw-pb-1.5">
      <div className="tw-text-2xl tw-tracking-normal tw-mb-2.5">{title}</div>
      <div className="tw-text-sm tw-tracking-normal">{pool}</div>
      <div className="tw-text-sm tw-tracking-normal tw-mb-4">
        {startDate} - {endDate}
      </div>
      <div>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tw-text-secondary tw-text-xs tw-underline"
        >
          {linkText}
        </a>
      </div>
    </div>
    <HighlightedBorder highlightColor={highlightColor} />
  </LootDropWrapper>
);
