import React from 'react';

interface Props {
  interestPerDay: number;
  principal: number;
}

export function InterestAPR(props: Props) {
  const APR = ((props.interestPerDay * 365) / props.principal) * 100;
  return <>{APR.toFixed(2)} %</>;
}
