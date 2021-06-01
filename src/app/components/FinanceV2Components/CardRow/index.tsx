import React from 'react';
import { StyledCardRow } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import cn from 'classnames';

interface ICardRowProps {
  LeftSection?: React.ReactNode;
  ChartSection?: React.ReactNode;
  DataSection?: React.ReactNode;
  Actions?: React.ReactNode;
  leftColor?: string;
  chartReady?: boolean;
}
export const CardRow: React.FC<ICardRowProps> = ({
  LeftSection,
  ChartSection,
  DataSection,
  Actions,
  leftColor,
  chartReady,
}: ICardRowProps) => {
  const { t } = useTranslation();

  return (
    <StyledCardRow
      className="d-flex tw-flex-row tw-items-center tw-mb-3 tw-rounded-lg tw-py-2.5 tw-px-4 tw-relative overflow-auto tw-justify-between"
      leftColor={leftColor}
    >
      {LeftSection && <div>{LeftSection}</div>}
      {ChartSection && (
        <div className="tw-ml-2 tw-mr-3 tw-relative tw-pointer-events-none tw-max-w-13rem 2xl:tw-max-w-md 2xl:tw-ml-4 2xl:tw-mr-5">
          {!chartReady && (
            <div className="tw-absolute tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-text-white tw-font-extralight tw-text-lg 2xl:tw-text-2xl tw-z-10">
              {t(translations.liquidityMining.chartOverlayText)}
            </div>
          )}
          <div className={cn({ 'tw-opacity-20': !chartReady })}>
            {ChartSection}{' '}
          </div>
        </div>
      )}
      {DataSection && <div>{DataSection}</div>}
      {Actions && <>{Actions}</>}
    </StyledCardRow>
  );
};
