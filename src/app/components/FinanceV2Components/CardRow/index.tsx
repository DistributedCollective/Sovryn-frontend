import React from 'react';
import { ChartWrapper, StyledCardRow } from './styled';

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
  return (
    <StyledCardRow
      className="d-flex tw-flex-row tw-items-center tw-mb-3 tw-rounded-lg tw-py-2.5 tw-px-4 tw-relative overflow-auto"
      leftColor={leftColor}
    >
      {LeftSection && <div>{LeftSection}</div>}
      {ChartSection && <ChartWrapper>{ChartSection}</ChartWrapper>}
      {DataSection && <div>{DataSection}</div>}
      {Actions && <div className="tw-ml-5 tw-w-full">{Actions}</div>}
    </StyledCardRow>
  );
};
