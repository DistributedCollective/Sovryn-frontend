import React from 'react';
import { StyledCardRow } from './styled';

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
      className="d-flex tw-flex-row tw-justify-between tw-items-center tw-mb-3 tw-bg-secondaryBackground tw-rounded-lg tw-p-4 tw-relative overflow-auto tw-gap-x-8"
      leftColor={leftColor}
    >
      {LeftSection && <div>{LeftSection}</div>}
      {ChartSection && <div>{ChartSection}</div>}
      {DataSection && <div>{DataSection}</div>}
      {Actions && <div className="tw-pr-6">{Actions}</div>}
    </StyledCardRow>
  );
};
