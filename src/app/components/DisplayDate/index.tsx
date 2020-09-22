import React from 'react';

interface Props {
  timestamp: string;
}

export function DisplayDate(props: Props) {
  const date = (timestamp: string) => new Date(Number(timestamp) * 1e3);
  const formatDate = date(props.timestamp).toLocaleString('en-GB', {
    timeZone: 'GMT',
  });
  return (
    <span>
      {formatDate.slice(0, 10)} {formatDate.slice(12, 17)} GMT
    </span>
  );
}
