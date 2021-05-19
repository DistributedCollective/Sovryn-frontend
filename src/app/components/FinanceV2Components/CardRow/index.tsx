import React from 'react';
import { ChartWrapper, StyledCardRow } from './styled';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface ICardRowProps {
  LeftSection?: React.ReactNode;
  ChartSection?: React.ReactNode;
  DataSection?: React.ReactNode;
  Actions?: React.ReactNode;
  leftColor?: string;
}
export const CardRow: React.FC<ICardRowProps> = ({
  LeftSection,
  ChartSection,
  DataSection,
  Actions,
  leftColor,
}: ICardRowProps) => {
  const { t } = useTranslation();

  return (
    <StyledCardRow
      className="d-flex tw-flex-row tw-items-center tw-mb-3 tw-rounded-lg tw-py-2.5 tw-px-4 tw-relative overflow-auto"
      leftColor={leftColor}
    >
      {LeftSection && <div>{LeftSection}</div>}
      {ChartSection && (
        <ChartWrapper>
          <div className="tw-absolute tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-text-secondary tw-text-2xl tw-z-10">
            {t(translations.liquidityMining.chartOverlayText)}
          </div>
          <div className="tw-opacity-20"> {ChartSection} </div>
        </ChartWrapper>
      )}
      {DataSection && <div>{DataSection}</div>}
      {Actions && <>{Actions}</>}
    </StyledCardRow>
  );
};
