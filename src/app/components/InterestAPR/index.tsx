import React from 'react';
import { useBorrowInterestRate } from '../../hooks/trading/useBorrowInterestRate';
import { Asset } from 'types/asset';

interface Props {
  collateral: string;
  asset: string;
}

export function InterestAPR(props: Props) {
  const interest = 'todo';
  return <>{interest}</>;
}
