import React from 'react';

import { StyledCardRow } from './styled';

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
  return (
    <StyledCardRow
      className="tw-flex tw-flex-row tw-items-center tw-mb-3 tw-rounded-lg tw-py-2.5 tw-px-4 tw-relative tw-overflow-auto tw-justify-between"
      leftColor={leftColor}
    >
      {LeftSection && <div>{LeftSection}</div>}
      {ChartSection && (
        <div className="tw-mr-3 tw-relative tw-min-w-md tw-max-w-md 2xl:tw-max-w-lg">
          {ChartSection}
        </div>
      )}
      {DataSection && <div>{DataSection}</div>}
      {Actions && <>{Actions}</>}
    </StyledCardRow>
  );
};
