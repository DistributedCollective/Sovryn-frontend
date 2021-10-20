import React from 'react';

interface Props {
  timestamp: string;
  timezoneOption?: string;
  timezoneLabel?: string;
}

export function DisplayDate({
  timestamp,
  timezoneOption = 'GMT',
  timezoneLabel = 'GMT',
}: Props) {
  const date = (timestamp: string) => new Date(Number(timestamp) * 1e3);
  const formatDate = date(timestamp).toLocaleString('en-GB', {
    timeZone: timezoneOption,
  });
  return (
    <span>
      {formatDate.slice(0, 10)}
      <br />
      {formatDate.slice(12, 17)} {timezoneLabel}
    </span>
  );
}
