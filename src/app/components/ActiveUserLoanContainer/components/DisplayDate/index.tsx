import React from 'react';
import dayjs from 'dayjs';

export enum SeparatorType {
  Dash = 'dash',
  Auto = 'auto',
}

const getSeparator = (separator: SeparatorType) => {
  switch (separator) {
    case SeparatorType.Auto:
      return '';
    case SeparatorType.Dash:
    default:
      return ' -';
  }
};

interface IDisplayDateProps {
  timestamp: string;
  useUTC?: boolean;
  separator?: SeparatorType;
}

export const DisplayDate: React.FC<IDisplayDateProps> = ({
  timestamp,
  separator = SeparatorType.Auto,
  useUTC = false,
}) => {
  const stamp = dayjs.tz(Number(timestamp) * 1e3, 'UTC');
  return (
    <span>
      {useUTC
        ? stamp.format(`YYYY/MM/DD${getSeparator(separator)} HH:mm [UTC]`)
        : stamp
            .tz(dayjs.tz.guess())
            .format(`L${getSeparator(separator)} LT [UTC] Z`)}
    </span>
  );
};
