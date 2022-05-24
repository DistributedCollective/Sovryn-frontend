import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import React from 'react';
import { Asset } from 'types/asset';
import { HighlightedBorder, LootDropColors, LootDropWrapper } from './styled';

interface ILootDropProps {
  title: string | JSX.Element;
  asset1: Asset;
  asset2?: Asset;
  startDate?: string;
  endDate?: string;
  message?: string;
  linkUrl: string;
  linkText: string;
  linkDataActionId: string;
  highlightColor: LootDropColors;
}

export const LootDrop: React.FC<ILootDropProps> = ({
  highlightColor,
  title,
  asset1,
  asset2,
  startDate,
  endDate,
  message,
  linkUrl,
  linkText,
  linkDataActionId,
}) => (
  <LootDropWrapper>
    <div className="tw-p-4 tw-pb-1.5">
      <div className="tw-text-2xl tw-tracking-normal tw-mb-2.5 tw-text-center">
        {title}
      </div>
      <div className="tw-text-sm tw-tracking-normal tw-text-center tw-font-bold">
        <div>
          <AssetSymbolRenderer asset={asset1} />
          {asset2 && (
            <>
              /
              <AssetSymbolRenderer asset={asset2} />
            </>
          )}
        </div>
      </div>
      <div className="tw-text-xs tw-tracking-normal tw-font-extralight tw-mb-3 tw-text-center">
        {!!startDate && !!endDate && `${startDate} - ${endDate}`}
        {!!message && message}
      </div>
      <div className="tw-text-center">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tw-text-secondary tw-text-xs tw-underline"
          data-action-id={linkDataActionId}
        >
          {linkText}
        </a>
      </div>
    </div>
    <HighlightedBorder highlightColor={highlightColor} />
  </LootDropWrapper>
);
