import React from 'react';

export enum SeparatorType {
  Dash = 'dash',
  Break = 'break',
}

const getSeparator = (separator: SeparatorType) => {
  switch (separator) {
    case SeparatorType.Break:
      return <br />;
    case SeparatorType.Dash:
      return '-';
    default:
      return '-';
  }
};

interface Props {
  timestamp: string;
  timezoneOption?: string;
  timezoneLabel?: string;
  separator?: SeparatorType;
}

export function DisplayDate({
  timestamp,
  timezoneOption = 'GMT',
  timezoneLabel = 'GMT',
  separator = SeparatorType.Break,
}: Props) {
  const date = (timestamp: string) => new Date(Number(timestamp) * 1e3);
  const formatDate = date(timestamp).toLocaleString('en-GB', {
    timeZone: timezoneOption,
  });
  return (
    <span>
      {formatDate.slice(0, 10)} {getSeparator(separator)}{' '}
      {formatDate.slice(12, 17)} {timezoneLabel}
    </span>
  );
}
